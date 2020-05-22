import dataset from '../../datasets/skills_example.json'
import { v4 } from 'uuid';

import {
    createTable as createExampleTable,
    insertExamples,
} from './example-queries';
import {
    createTable as createSkillTable,
    insertSkill,
} from './skill-queries';

export default async () => {
    await createSkillTable()
    await createExampleTable();

    dataset.skills.forEach(async (skill) => {
        const skillid = v4();

        await insertSkill({
            id: skillid,
            name: 'example123',
            forwardAddress: 'http://test.com',
            forwardType: 0,
            lastUpdated: ~~(Date.now() / 1000),
        })


        await insertExamples({
            examples: skill.examples.map(example => ({
                id: v4(),
                skillId: skillid,
                subsetId: example.group,
                plainWords: example.plainWords.join(','),
                pos: example.pos.join(','),
                features: example.features.join(','),
            })),
        })
    })
}