export default (tagged: Array<string>) => {
    const tags : {[id: string]: number} = {};

    for (const i in tagged) {
        if (Object.prototype.hasOwnProperty.call(tagged, i)) {
            const taggedWord = tagged[i];
            const tag = taggedWord[1];

            if (typeof tags[tag] === 'undefined') {
                tags[tag] = 0;
            }

            tags[tag] += 1;
        }
    }

    return tags;
};