import {
    Skill,
    DetermineSkillRequest,
    DetermineSkillResponse,
} from './types';
import {
    ResolverValueSet,
    ResolvedConfidence,
    ResolvedEpisode,
    ConfidenceResponse,
} from '../common/types';
import { extractFeatures, average } from '../utils';
import { createPOSMapping } from '../utils/pos';
import featureResolver from '../feature-resolvers';
import eaba from '../feature-resolvers/eaba';
import { skillQueries, exampleQueries } from '../datasource';

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

const isScoredHigher = (
    base: ResolvedEpisode, comparer: ResolvedEpisode,
): boolean => (
        comparer.score > base.score && comparer.confidence > base.confidence
    );

export const findBestFit = async (
    requestMore: (offset: number) => Promise<Array<Skill>>,
    count: number,
    rpcMessage: string,
): Promise<ResolvedEpisode> => {
    const comparerSet = constructComparerSet(rpcMessage);

    let offset = 0;
    let globalBest = { confidence: 0, score: 0 } as ResolvedEpisode;

    // score each groups of features
    while (offset < count) {
        const requests = await requestMore(offset);

        // resolve all of the sets within our request "episode"
        const resolvedRequests: Array<ResolvedEpisode> = await Promise.all(
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

        // determine the best fit of the episode
        const episodeBest: ResolvedEpisode = resolvedRequests.reduce((
            a: ResolvedEpisode, set: ResolvedEpisode,
        ): ResolvedEpisode => {
            return isScoredHigher(a, set)
                ? set
                : a;
        }, { confidence: 0, score: 0 } as ResolvedEpisode);

        if (isScoredHigher(globalBest, episodeBest)) {
            globalBest = episodeBest;
        }

        offset += 50;
    }

    return globalBest;
}

export default async (request: DetermineSkillRequest):
    Promise<DetermineSkillResponse> => {
    const startTime = Date.now();

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

    const bestFit = await findBestFit(
        fetchMore,
        ids.length,
        request.message as string);

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