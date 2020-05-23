import {
    ResolverContext,
    ConfidenceResponse,
} from '../common/types';
import { calcConfidence } from '../utils';

// @@ synonyms
export default async (ctx: ResolverContext):
    Promise<ConfidenceResponse> => calcConfidence(
        ctx.comparerSet.features.filter(
            feature => ctx.exampleSet.features.includes(feature),
        ).map(_ => 80), 80);
