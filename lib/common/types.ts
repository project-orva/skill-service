export interface ConfidenceResponse {
    sum: number,
    confidence: number
}

export interface Config {
    maxScore: number,
    uniqueMax: number,
}

export interface DictionaryApi {
    getWord(word: string): Array<{
        fl: string,
        meta: {
            syns: Array<Array<string>>,
        },
    }>
}

export interface ResolverValueSet {
    plainWords: Array<string>,
    pos: Array<string>,
}

export interface ResolverContext {
    dictionaryApi: DictionaryApi,
    exampleSet: ResolverValueSet,
    comparerSet: ResolverValueSet,
}
