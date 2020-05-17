import {
    findBestFit, bestGroup,
} from './determine-skill';

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

            expect(resp).toEqual('2')
        })
    })
    describe('findBestFit', () => {
        it('should find the best fit provided a valid dataset',
            async () => {
                const fetchMore = async (offset: number) => dataset.skills;
                const response = await findBestFit(
                    fetchMore, dataset.skills.length, 'turn on light',
                )

                expect(response.setId).toEqual('0')
                expect(response.groupBestFit).toEqual('1')
            })
    })
})