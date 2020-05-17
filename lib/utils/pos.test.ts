import { createTagged } from './pos';

describe('pos', () => {
    describe('createTagged', () => {
        it('should created a tagged structure', () => {
            expect(createTagged('turn off the light')).toEqual(
                [['turn', 'VB'], ['off', 'IN'], ['the', 'DT'], ['light', 'NN']],
            )
        })
    })
})