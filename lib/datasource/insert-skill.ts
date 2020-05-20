import baseQuery from './base-query';

export default async (client: any, variables: any): Promise<any> => baseQuery(
    client,
    `INSERT INTO SKILL
        (ID, GROUP, PLAIN_WORDS, POS, FEATURES, FORWARD_ADDRESS, INIT_ON)
        VALUES (
            ${variables.id},
            ${variables.group},
            ${variables.plainWords},
            ${variables.pos},
            ${variables.features},
            ${variables.forwardAddress},
            ${variables.initOn}
        )
    `,
);
