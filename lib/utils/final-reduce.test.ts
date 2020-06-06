import finalReduce from './final-reduce';

describe('final reduce', () => {
    it('works as expected', () => {
        expect(finalReduce([1, 2, 3], (a, c, final) => {
            if (c === 2) {
                final()
            }

            return [...a, c]
        })).toEqual([1, 2])
    })
})