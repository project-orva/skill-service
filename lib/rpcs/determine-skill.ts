import {
    SkillResponse,
    Skill,
} from './determine-skill.types';
import { ResolverValueSet } from '../common/types';
import extractFeatures from '../utils/extract-features';
import { createPOSMapping } from '../utils/pos';

const constructComparerSet = (rpcMessage: string): ResolverValueSet => {
    const mappings = createPOSMapping(
        rpcMessage,
    );
    const messageFeatures: Array<string> = extractFeatures(mappings);

    return {
        plainWords: mappings.plainWords,
        pos: mappings.pos,
        features: messageFeatures,
    }
}

const determineSkill = async (
    requestMore: (offset: number) => Promise<Skill>,
    count: number,
    rpcMessage: string,
): Promise<SkillResponse> => {
    const comparerSet = constructComparerSet(rpcMessage);
 
    // score each groups of features

    // pick group with highest decision

    return {} as SkillResponse;
}

const fetchMore = (offset: number): Skill => {
    return {} as Skill
}

export default async (call: any, cb: any): void => {
    // @@ make api call.

    const d = await determineSkill(fetchMore, 2, call.request.Message as string)

    console.log('determine skill called')
    call.end();
}