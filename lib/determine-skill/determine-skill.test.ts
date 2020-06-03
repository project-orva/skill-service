import {
    applyComparision, bestGroup,
} from './index';

import dataset from '../../datasets/skills_example.json';
import { ConfidenceResponse, ProcessedSkill } from '../common/types';

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
        it('correctly sort the resolved comparisions', () => {

        })
    })
    describe('applyComparision', () => {
        it('correctly applies comparisions', async () => {
            const fetchMore = async (offset: number) => dataset.skills;
            const response = await applyComparision(
                fetchMore, dataset.skills.length, 2, 'turn on light',
            )

            expect(response).toEqual([]);
        })
    })
})