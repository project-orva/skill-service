import baseQuery from './base-query';

export interface SkillDatasource {
    id: string,
    name: string,
    forwardAddress: string,
    forwardType: number,
    lastUpdated: number,
}

export const createTable = () => baseQuery(
    `
    CREATE TABLE IF NOT EXISTS SKILL(
        ID  CHAR(36) PRIMARY KEY    UNIQUE NOT NULL,
        NAME TEXT NOT NULL,
        FORWARD_ADDRESS TEXT NOT NULL,
        FORWARD_TYPE    INT     NOT NULL,
        LAST_UPDATED    INT     NOT NULL
     );
    `,
)

export const upsertSkill = (variables: any) => baseQuery(
    `
    INSERT INTO SKILL (
        ID,
        NAME,
        FORWARD_ADDRESS,
        FORWARD_TYPE,
        LAST_UPDATED
    ) VALUES (
        '${variables.id}',
        '${variables.name}',
        '${variables.forwardAddress}',
        '${variables.forwardType}',
        '${variables.lastUpdated}'
    ) ON CONFLICT (ID) DO UPDATE
        SET NAME = '${variables.name}',
            FORWARD_ADDRESS = '${variables.forwardAddress}',
            FORWARD_TYPE = '${variables.forwardType}',
            LAST_UPDATED = '${variables.lastUpdated}'
    `,
)

export const selectForwardAddressByID = async (
    variables: any,
): Promise<any> => baseQuery(
    `SELECT FORWARD_ADDRESS FROM SKILL WHERE ID='${variables.id}'`,
);

export const selectAllSkillIds = async ():
    Promise<Array<{ id: string }>> => baseQuery(
        `SELECT ID FROM SKILL`,
    );

export const insertSkill = (
    variables: any,
): Promise<any> => baseQuery(
    `INSERT INTO SKILL
        (ID, NAME, FORWARD_ADDRESS, FORWARD_TYPE, LAST_UPDATED)
        VALUES (
            '${variables.id}',
            '${variables.name}',
            '${variables.forwardAddress}',
            '${variables.forwardType}',
            '${variables.lastUpdated}'
        )
    `,
);