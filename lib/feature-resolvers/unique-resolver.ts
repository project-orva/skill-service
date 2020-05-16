import config from '../config'
import { calcConfidence } from '../utils';
import { ResolverContext, ConfidenceResponse } from '../common/types';

export default (ctx: ResolverContext): ConfidenceResponse => {
  const { plainWords: exampleWords } = ctx.exampleSet;
  const { plainWords: messageWords } = ctx.comparerSet;

  const score: Array<number> = [];
  exampleWords.forEach((word, idx) => {
    if (messageWords.includes(word)) {
      score.push(config.uniqueMax >> Math.abs(
        idx - messageWords.indexOf(word),
      ));
    } else {
      score.push(0);
    }
  });

  return calcConfidence(score, config.uniqueMax);
};
