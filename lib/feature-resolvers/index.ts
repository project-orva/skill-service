import {
    ResolverContext,
    ConfidenceResponse,
    ResolverValueSet,
} from '../common/types';

const scoreResolvers = async (
    resolvers: Array<Resolver>,
    { exampleSet, comparerSet }:
    { exampleSet: ResolverValueSet, comparerSet: ResolverValueSet },
) => await Promise.all(resolvers
    .map(async (resolver) => await resolver({
        exampleSet,
        comparerSet,
    } as ResolverContext)));

type Resolver = (ctx: ResolverContext) => ConfidenceResponse;

export default (resolvers: Array<Resolver>) => (
    exampleSet: ResolverValueSet,
    comparerSet: ResolverValueSet,
) => scoreResolvers(resolvers, { exampleSet, comparerSet })
