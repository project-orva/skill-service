import { ResolverValueSet } from '../common/types';
import { convertToFL } from '../utils/determine-functional-label';

export default ({ pos, plainWords }: ResolverValueSet): Array<string> => pos.
    map((part, idx) => ({ fl: convertToFL(part), idx })).
    reduce((a: any, c: any) => {
        if (c.fl === 'noun' || c.fl === 'adjective') {
            return [...a, plainWords[c.idx]]
        }
        return a
    }, [])