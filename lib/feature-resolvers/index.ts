import {
    ResolverContext,
    ConfidenceResponse,
    ResolverValueSet,
} from '../common/types';

const scoreResolvers = async (
    resolvers: Array<Resolver>,
    { exampleSet, comparerSet }:
        { exampleSet: ResolverValueSet, comparerSet: ResolverValueSet },
): Promise<Array<ConfidenceResponse>> => Promise.all(resolvers
    .map(async (resolver) => {
        const { confidence, sum } = await resolver({
            exampleSet,
            comparerSet,
        } as ResolverContext);

        return {
            sum,
            confidence,
            group: exampleSet.group,
        } as ConfidenceResponse;
    }));

type Resolver = (ctx: ResolverContext) => Promise<ConfidenceResponse>;
type ResolverCb = (
    exampleSet: ResolverValueSet,
    comparerSet: ResolverValueSet,
) => Promise<ConfidenceResponse[]>

export default (resolvers: Array<Resolver>):
    ResolverCb => (
        exampleSet: ResolverValueSet,
        comparerSet: ResolverValueSet,
    ): Promise<Array<ConfidenceResponse>> => scoreResolvers(
        resolvers,
        { exampleSet, comparerSet },
    )
