import { v4 as uuid } from 'uuid';

import { exampleQueries, skillQueries } from '../datasource';
import { Example } from '../datasource/example-queries';
import { createPOSMapping } from '../utils/pos';
import { extractFeatures } from '../utils';

export interface RegisterRequest {
    SkillName: string,
    ForwardAddress: string,
    ForwardType: number,
    Examples: Array<{
        ExampleText: string,
        GroupID: string,
    }>,
}

export interface RegisterResponse {
    IsRegistered: boolean,
}

interface Transformation {
    skill: skillQueries.Skill,
    examples: Array<exampleQueries.Example>
}

export const transformRequest = (request: RegisterRequest): Transformation => {
    const skillId = uuid();

    const skill = {
        id: skillId,
        name: request.SkillName,
        forwardAddress: request.ForwardAddress,
        forwardType: request.ForwardType,
        lastUpdated: ~~(Date.now() / 1000),
    } as skillQueries.Skill;

    const examples = request.Examples.map((example: {
        ExampleText: string,
        GroupID: string,
    }) => {
        const posMap = createPOSMapping(example.ExampleText)
        return ({
            skillId,
            id: uuid(),
            subsetId: example.GroupID,
            plainWords: posMap.plainWords,
            pos: posMap.pos,
            features: extractFeatures(posMap),
        })
    }) as Array<Example>

    return {
        skill,
        examples,
    } as Transformation
}

export default async (request: RegisterRequest): Promise<RegisterResponse> => {
    const transformedRequest = transformRequest(request);

    try {
        await skillQueries.insertSkill(transformedRequest.skill);

        await exampleQueries.insertExamples({ examples: request.Examples });

        return { IsRegistered: true } as RegisterResponse;
    } catch (err) {
        return { IsRegistered: false } as RegisterResponse;
    }
}