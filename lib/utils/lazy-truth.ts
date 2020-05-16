export default (
    obj: { [id: string]: string },
    compareFn: (thing: string) => boolean,
): string | undefined => {
    const match = Object.keys(obj).find(compareFn);

    return (match) ? obj[match] : undefined;
}