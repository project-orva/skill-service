import baseQuery from './base-query';

export interface Example {
    id: string,
    skillId: string,
    subsetId: string,
    plainWords: Array<string>,
    pos: Array<string>,
    features: Array<string>,
}

export const insertExamples = (variables: any) => baseQuery(
    `INSERT INTO EXAMPLE
        (ID, SKILL_ID, SUBSET_ID, PLAIN_WORDS, POS, FEATURES)
        VALUES ${variables.examples.map((example: any) => (
            `(
                '${example.id}',
                '${example.skillId}',
                '${example.subsetId}',
                '${example.plainWords}',
                '${example.pos}',
                '${example.features}'
            )`
        )).join(',')}
    `,
);

export const createTable = async (): Promise<any> => baseQuery(
    `
    CREATE TABLE IF NOT EXISTS EXAMPLE(
        ID  CHAR(36) PRIMARY KEY     NOT NULL,
        SKILL_ID CHAR(36) NOT NULL,
        SUBSET_ID       TEXT    NOT NULL,
        PLAIN_WORDS     TEXT    NOT NULL,
        POS             TEXT    NOT NULL,
        FEATURES        TEXT    NOT NULL
     );
    `,
)

export const selectExampleById = async (
    variables: any,
): Promise<any> => baseQuery(
    `SELECT GROUP, PLAIN_WORDS, POS, FEATURES
        WHERE ID='${variables.id}' from EXAMPLE
    `,
);