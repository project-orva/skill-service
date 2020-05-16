import config from '../config';
import {
    ResolverContext,
    ConfidenceResponse,
} from '../common/types';
import {
    determineFunctionalLabel,
    calcConfidence,
} from '../utils';

export default async (ctx: ResolverContext): Promise<ConfidenceResponse> => {
    const scores: Array<number> = [];
    const { plainWords: exampleWords, pos: exampleTags } = ctx.exampleSet;
    const { plainWords: inputWords } = ctx.comparerSet;

    for (let idx = 0; idx < exampleWords.length; idx++) {
        const unique = exampleWords[idx];

        // check to see if a synonym of the unique word is being used.
        const fl = determineFunctionalLabel(exampleTags, exampleWords, unique);
        const wordData = await ctx.dictionaryApi
            .getWord(unique);

        const topFL = wordData.filter((w) => w.fl === fl)[0];
        if (topFL === undefined) {
            continue;
        }

        topFL.meta.syns[0].forEach((syn) => {
            if (inputWords.includes(syn)) {
                scores.push(config.maxScore);
            } else {
                scores.push(0);
            }
        });
    }

    return calcConfidence(scores, config.maxScore);
};
