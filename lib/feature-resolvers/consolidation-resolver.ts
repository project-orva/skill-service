import config from '../config';
import { ConfidenceResponse, ResolverContext } from '../common/types';
import { calcConfidence, consolidateTags } from '../utils';

export default (ctx: ResolverContext): ConfidenceResponse => {
    const { pos: exampleTags } = ctx.exampleSet;
    const { pos: inputTags } = ctx.comparerSet;

    const conExampleTags = consolidateTags(exampleTags);
    const conMessageTags = consolidateTags(inputTags);

    const exampleKeys = Object.keys(conExampleTags);

    const scores: Array<number> = [];
    exampleKeys.forEach((key) => {
        if (!(key in conMessageTags)) {
            return;
        }

        // best case -> 0
        const dist = conExampleTags[key] - conMessageTags[key];

        scores.push(config.maxScore >> Math.abs(dist));
    });

    return calcConfidence(scores, config.maxScore);
};

