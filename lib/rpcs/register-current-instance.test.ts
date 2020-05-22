import { transformRequest, RegisterRequest } from './register-current-instance';

describe('registerCurrentInstance', () => {
    describe('transformRequest', () => {
        xit('should transform successfully provided a valid request', () => {
            const re = transformRequest({
                SkillName: 'skill',
                ForwardAddress: 'http://site.com',
                ForwardType: 0,
                Examples: [
                    {
                        ExampleText: 'this is a test',
                        GroupID: '02',
                    },
                    {
                        ExampleText: 'this is maybe still a test',
                        GroupID: '01',
                    },
                ],
            } as RegisterRequest)
        })
    })
})