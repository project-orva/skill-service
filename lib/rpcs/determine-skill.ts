import {
    Skill,
} from './determine-skill.types';
import {
    ResolverValueSet,
    ResolvedConfidence,
    ResolvedEpisode,
    ConfidenceResponse,
    BestFit,
} from '../common/types';
import { extractFeatures, average } from '../utils';
import { createPOSMapping } from '../utils/pos';
import featureResolver from '../feature-resolvers';
import eaba from '../feature-resolvers/eaba';

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

    return {
        score: average(scores.map(
            (x: ConfidenceResponse) => x.sum)),
        confidence: average(scores.map(
            (x: ConfidenceResponse) => x.confidence)),
        groupBestFit: bestGroup(scores).toString(),
    }
}

export const bestGroup = (scores: Array<ConfidenceResponse>) => scores.reduce(
    (a, c) => {
        if (c.sum >= a.sum && c.confidence >= a.confidence) {
            return c
        }

        return a
    }, { sum: 0, confidence: 0} as ConfidenceResponse).group;

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

const fetchMore = (offset: number): Skill => {
    return {} as Skill
}

export default async (call: any, cb: any): Promise<void> => {
    // @@ make api call.
    // const d = await findBestFit(fetchMore, 2, call.request.Message as string)

    console.log('determine skill called')
    call.end();
}