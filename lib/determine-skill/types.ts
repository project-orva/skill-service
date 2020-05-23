import { ResolverValueSet } from '../common/types';

export interface SkillResponse {
    Accuracy: number,
    Duration: number,
    ForwardAddress: string
}

export interface Skill {
    id: string,
    examples: Array<ResolverValueSet>
}

export interface DetermineSkillRequest {
    message: string,
}

export interface DetermineSkillResponse {
    accuracy: number,
    duration: number,
    forwardAddress: string,
    subsetID: string,
}
