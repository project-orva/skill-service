import {
    applyComparision,
    bestGroup,
    sortResolvedComparisions,
    fitComparisions,
} from './index';

import dataset from '../../datasets/skills_example.json';
import { ConfidenceResponse } from '../common/types';

describe('determine skill', () => {
    describe('bestGroup', () => {
        it('should returns` the best group provided a valid set', () => {
            const resp = bestGroup([
                { sum: 0, confidence: 0, group: '0' },
                { sum: 0, confidence: 0, group: '1' },
                { sum: 2, confidence: 0, group: '2' },
            ] as Array<ConfidenceResponse>);

            expect(resp.group).toEqual('2')
        })
    })
    describe('sortResolvedComparisions', () => {
        it('correctly sorts the resolved comparisions', () => {
            const response = sortResolvedComparisions([{
                confidence: 1,
                groupBestFit: '1',
                score: 160,
                setId: '0',
            },
            {
                confidence: 1,
                groupBestFit: '1',
                score: 80,
                setId: '1',
            }])

            expect(response).toEqual([{
                confidence: 1,
                groupBestFit: '1',
                score: 160,
                normalized: 160,
                setId: '0',
            },
            {
                confidence: 1,
                groupBestFit: '1',
                normalized: 80,
                score: 80,
                setId: '1',
            }])
        })
    })
    describe('applyComparision', () => {
        it('correctly applies comparisions', async () => {
            const fetchMore = async (offset: number) => dataset.skills;
            const response = await applyComparision(
                fetchMore, dataset.skills.length, 2, 'turn on light',
            )

            expect(response).toEqual([{
                confidence: 1,
                groupBestFit: '1',
                score: 160,
                setId: '0',
            },
            {
                confidence: 1,
                groupBestFit: '1',
                score: 80,
                setId: '1',
            },
            ]);
        })
    })
    describe('fitComparisions', () => {
        it('fits comparisions', () => {
            const resp = fitComparisions([{
                confidence: 1,
                groupBestFit: '1',
                score: 160,
                normalized: 160,
                setId: '0',
            },
            {
                confidence: 1,
                groupBestFit: '1',
                normalized: 80,
                score: 80,
                setId: '1',
            }])

            expect(resp).toEqual([
                {
                    confidence: 1,
                    groupBestFit: "1",
                    normalized: 160,
                    score: 160,
                    setId: "0",
                },
            ])
        })
    })
})