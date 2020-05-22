import baseQuery from './base-query';

export interface Skill {
    id: string,
    name: string,
    forwardAddress: string,
    forwardType: number,
    lastUpdated: number,
}

export const createTable = () => baseQuery(
    `
    CREATE TABLE IF NOT EXISTS SKILL(
        ID  CHAR(36) PRIMARY KEY     NOT NULL,
        NAME TEXT NOT NULL,
        FORWARD_ADDRESS TEXT NOT NULL,
        FORWARD_TYPE    INT     NOT NULL,
        LAST_UPDATED    INT     NOT NULL
     );
    `,
)

export const selectForwardAddressByID = async (
    variables: any,
): Promise<any> => baseQuery(
    `SELECT FORWARD_ADDRESS WHERE ID='${variables.id}' from SKILL`,
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