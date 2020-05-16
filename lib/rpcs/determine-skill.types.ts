export interface SkillResponse {
    Accuracy: number,
    Duration: number,
    ForwardAddress: string
}

export interface SkillExample {
    ExampleText: string,
    TextPOS: string,
}

export interface Skill {
    SkillName: string,
    SkillID: number,
    Examples: Array<SkillExample>
}