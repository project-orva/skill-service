export default (values: Array<number>): number => values.reduce(
    (a: number, c: number) => a + c) / values.length;
