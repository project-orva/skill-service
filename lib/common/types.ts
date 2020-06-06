export interface ConfidenceResponse {
    sum: number,
    confidence: number,
    group: string | number,
}

export interface ResolvedConfidence {
    score: number,
    confidence: number,
    groupBestFit: string,
}

export interface ProcessedSkill extends ResolvedConfidence {
    id: string,
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
    group: string | undefined,
    plainWords: Array<string>,
    pos: Array<string>,
    features: Array<string>,
}

export interface ResolverContext {
    dictionaryApi: DictionaryApi,
    exampleSet: ResolverValueSet,
    comparerSet: ResolverValueSet,
}

export interface ResolvedEpisode extends ResolvedConfidence {
    setId: string,
}

export interface NormalizedResolvedEpisode extends ResolvedEpisode {
    normalized: number,
}