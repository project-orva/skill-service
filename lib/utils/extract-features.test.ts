import ExtractFeatures from './extract-features';
import { ResolverValueSet } from '../common/types';

const mock = {
    pos: ['VB', 'PRT', 'DT', 'NN'],
    plainWords: ['turn', 'off', 'the', 'light'],
}

describe('extract features', () => {
    it('should correctly extract features provided a valid value set', () => {
        expect(ExtractFeatures(mock as ResolverValueSet)).toEqual(['light'])
    });
})