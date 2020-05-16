import config from '../config';
import {
    ResolverContext,
    ConfidenceResponse,
} from '../common/types';
import { calcConfidence } from '../utils';

// @@ synonyms
export default (ctx: ResolverContext): ConfidenceResponse => calcConfidence(
    ctx.comparerSet.features.filter(
        feature => ctx.exampleSet.features.includes(feature),
    ).map(f => config.maxScore), config.maxScore);
