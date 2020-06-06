import {
    ResolverValueSet,
    ResolvedConfidence,
    NormalizedResolvedEpisode,
    ResolvedEpisode,
    ConfidenceResponse,
} from '../common/types';
import { extractFeatures, finalReduce } from '../utils';
import { createPOSMapping } from '../utils/pos';
import featureResolver from '../feature-resolvers';
import eaba from '../feature-resolvers/eaba';
import { skillQueries, exampleQueries } from '../datasource';

import {
    Skill,
    DetermineSkillRequest,
    DetermineSkillResponse,
} from './types';

const resolver = featureResolver([eaba]);

const constructComparerSet = (rpcMessage: string): ResolverValueSet => {
    const mappings = createPOSMapping(
        rpcMessage,
    );
    const messageFeatures: Array<string> = extractFeatures(mappings);

    return {
        plainWords: mappings.plainWords,
        pos: mappings.pos,
        features: messageFeatures,
        group: undefined,
    } as ResolverValueSet
}

// resolveCurrent: provided example and base comparer
// find the subgroup fit for the currentSet
const resolveCurrentSet = async (
    comparerSet: ResolverValueSet,
    currentSet: Array<ResolverValueSet>,
): Promise<ResolvedConfidence> => {
    const resolvedSet = await Promise.all(
        currentSet.map(async (exampleSet) => await resolver(
            exampleSet, comparerSet,
        )),
    );

    const scores = resolvedSet.reduce((
        a: Array<ConfidenceResponse>,
        resolved: Array<ConfidenceResponse>,
    ) => [
            ...a,
            ...resolved,
        ], [] as Array<ConfidenceResponse>);

    const beg = bestGroup(scores)

    return {
        score: beg.sum,
        confidence: beg.confidence,
        groupBestFit: beg.group.toString(),
    }
}

export const bestGroup = (scores: Array<ConfidenceResponse>):
    ConfidenceResponse => scores.reduce(
        (a, c) => {
            if (c.sum >= a.sum && c.confidence >= a.confidence) {
                return c
            }

            return a
        }, { sum: 0, confidence: 0 } as ConfidenceResponse);

export const applyComparision = async (
    requestMore: (offset: number) => Promise<Array<Skill>>,
    count: number,
    batchSize: number,
    rpcMessage: string,
): Promise<Array<ResolvedEpisode>> => {
    const comparerSet = constructComparerSet(rpcMessage);

    let offset = 0;
    let resolvedRequests: Array<ResolvedEpisode> = [];

    // score each groups of features
    while (offset < ~~(count / batchSize)) {
        const requests = await requestMore(offset);
        const resolved = await Promise.all(
            requests.map(async (set): Promise<ResolvedEpisode> => {
                const resolvedSet = await resolveCurrentSet(
                    comparerSet, set.examples,
                );

                return {
                    groupBestFit: resolvedSet.groupBestFit,
                    score: resolvedSet.score,
                    confidence: resolvedSet.confidence,
                    setId: set.id,
                }
            }),
        );

        resolvedRequests = resolvedRequests.concat(resolved);
        offset += 1;
    }

    return resolvedRequests;
}

export const normalizeResolved = (
    resolved: ResolvedEpisode,
) => resolved.score / resolved.confidence;

export const sortResolvedComparisions = (
    comparisions: Array<ResolvedEpisode>,
): Array<NormalizedResolvedEpisode> => comparisions.
    map(x => ({ ...x, normalized: normalizeResolved(x) })).
    sort((a, b) => b.normalized - a.normalized);

export const predictComparisions = (
    normalized: Array<NormalizedResolvedEpisode>,
): Array<ResolvedEpisode> => {
    const fits: Array<ResolvedEpisode> = [];

    if (normalized[0].confidence < 1) {
        return fits;
    }

    return finalReduce(normalized, (a, c, final) => {
        if (a.length === 0) {
            return [c];
        }

        if (c.normalized - a[a.length - 1] <= (c.normalized / 40)) {
            return [...a, c];
        }

        return final()
    });
}

export default async (request: DetermineSkillRequest):
    Promise<DetermineSkillResponse> => {
    const startTime = Date.now() / 1000;

    const ids: Array<string> = (await skillQueries.
        selectAllSkillIds()).
        map((x) => x.id);

    const fetchMore = async (): Promise<Array<Skill>> => {
        const currentId = ids.pop();
        const examples = await exampleQueries.selectExampleById({
            id: currentId,
        });

        return [{
            id: currentId,
            examples: examples.map((x: any) => ({
                group: x['subset_id'],
                plainWords: x['plain_words'].split(','),
                pos: x.pos.split(','),
                features: x.features.split(','),
            })) as Array<ResolverValueSet>,
        } as Skill]
    }

    const compared = await applyComparision(
        fetchMore,
        ids.length,
        1,
        request.message,
    );

    const sortedComparion = sortResolvedComparisions(compared);
    const fits = predictComparisions(sortedComparion);

    // @@ doing it this way so in the future we can have access to the rest
    // of the predictions. might provide some insight at one point.
    const [bestFit] = fits;

    if (fits.length === 0) {
        return {} as DetermineSkillResponse;
    }

    const resp = (await skillQueries.selectForwardAddressByID({
        id: bestFit.setId,
    }))[0];

    return ({
        accuracy: bestFit.confidence,
        duration: Date.now() - startTime, // ms
        forwardAddress: resp ? resp['forward_address'] : null,
        subsetID: bestFit.groupBestFit,
    });
}