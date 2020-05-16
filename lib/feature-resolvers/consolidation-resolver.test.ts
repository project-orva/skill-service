import consolidationResolver from './consolidation-resolver';
import { ResolverContext } from '../common/types';

const mock = {
    exampleSet: { pos: ['VB', 'PRT', 'DT', 'NN'] },
    comparerSet: { pos: ['VB', 'PRT', 'DT', 'NN'] },
}

describe('consolidation resolver', () => {
    it('should resolve successfully, provided valid input', () => {
        const res = consolidationResolver(mock as ResolverContext)

        expect(res).toEqual({ 'confidence': 1, 'sum': 320 })
    });
});
