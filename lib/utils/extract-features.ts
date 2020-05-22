import { convertToFL } from '../utils/determine-functional-label';
import { lazyTruth } from '../utils';

export default ({ pos, plainWords }: {
    plainWords: Array<string>, pos: Array<string>,
}): Array<string> => pos.
    map((part, idx) => ({ fl: convertToFL(part), idx })).
    reduce((a: any, c: any) => {
        if (!!lazyTruth<boolean>({
            'noun': true,
            'adjective': true,
            'preposition': true,
        }, (ops: string) => ops === c.fl)) {
            return [...a, plainWords[c.idx]]
        }
        return a
    }, [])