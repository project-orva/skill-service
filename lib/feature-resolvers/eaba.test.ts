import eaba from './eaba';
import { ResolverContext } from '../common/types';

const mock = {
    exampleSet: {
        features: ['light', 'on'],
    },
    comparerSet: {
        features: ['light'],
    },
}

describe('eaba', () => {
    it('should return confidence provided a valid ctx', () => {
        expect(eaba(mock as ResolverContext)).toEqual({})
    })
})