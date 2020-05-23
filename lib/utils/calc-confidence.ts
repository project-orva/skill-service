import { ConfidenceResponse } from '../common/types';

export default (
    values: Array<number>,
    maxScore: number,
): ConfidenceResponse => {
    if (values.length === 0) {
        return { sum: 0, confidence: 0 } as ConfidenceResponse;
    }

    const sum = values.reduce((a: number, c: number) => a + c);
    const maxSum = values.length * maxScore;
    console.log("conf", values, sum, maxScore, maxSum / sum)

    return {
        sum,
        confidence: maxSum / sum,
        group: 'na',
    };
};
