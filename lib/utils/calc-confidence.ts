import { ConfidenceResponse } from '../common/types';

export default (
    values: Array<number>,
    maxScore: number,
): ConfidenceResponse => {
    const sum = values.reduce((a: number, c: number) => a + c);
    const maxSum = values.length * maxScore;

    return {
        sum,
        confidence: sum / maxSum,
    };
};
