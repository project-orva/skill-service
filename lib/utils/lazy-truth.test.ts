import lazyTruth from './lazy-truth';

describe('lazyTruth', () => {
    it('should return a match if a match is present', () => {
        const f = lazyTruth({
            'test': '123',
            'test12': '51',
        }, (s) => s === 'test12');

        expect(f).toEqual('51')
    });

    it('should return undefined if a match is not present', () => {
        const f = lazyTruth({
            'test': '123',
            'test12': '51',
        }, (s) => s === 'test1251');

        expect(f).toEqual(undefined)
    })
})