type finalCb = (a: any, c: any, final?: any) => void;

export default (arr: Array<any>, fn: finalCb, initialValue?: any) => {
    let isFinal = false;
    let accumlator = initialValue || [];

    const final = () => {
        isFinal = true;
        return accumlator;
    };

    let i = 0;
    while (!isFinal && i < arr.length) {
        accumlator = fn(accumlator, arr[i], final)

        i++;
    }

    return accumlator;
}