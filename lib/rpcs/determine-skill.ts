import {
    SkillResponse,
    Skill,
} from './determine-skill.types';

const determineSkill = (requestMore: (offset: number) => Skill, rpcMessage: string): SkillResponse | null => {
    // extract features

    // score each groups of features

    // pick group with highest decision

    return null;
}

const fetchMore = (offset: number): Skill => {
    return {} as Skill
}

export default (call: any, cb: any): any => {
    const d = determineSkill(fetchMore, call.request.Message as string)

    console.log('determine skill called')
    call.end();
}