import determineFunctionalLabel from './determine-functional-label';

describe('deteremineFunctionalLabels', () => {
    it('should correctly determine fls provided a valid sets', () => {
        const fl = determineFunctionalLabel(
            ['VB', 'PRT', 'DT', 'NN'],
            ['turn', 'off', 'the', 'light'],
            'light',
        )

        expect(fl).toEqual('noun')
    })
})