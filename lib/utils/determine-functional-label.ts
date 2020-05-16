import { lazyTruth } from '../utils';

export const convertToFL = (tag: string): string | undefined => {
    const fls = ({
        'NN': 'noun',
        'VB': 'verb',
        'JJ': 'adjective',
    })

    const flPrefix: string = tag.slice(0, 2)
    return lazyTruth(fls, (fl: string) => fl === flPrefix)
};

export default (
    orderedTags: Array<string>,
    statements: Array<string>,
    word: string,
) => convertToFL(
    orderedTags[statements.indexOf(word)],
);
