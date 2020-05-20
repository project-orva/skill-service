import baseQuery from './base-query';

export default (client: any) => baseQuery(
    client,
    `
    CREATE TABLE SKILL(
        ID  CHAR(36) PRIMARY KEY     NOT NULL,
        SUBSET_ID       TEXT    NOT NULL,
        PLAIN_WORDS     TEXT    NOT NULL,
        POS             TEXT    NOT NULL,
        FEATURES        TEXT    NOT NULL,
        FORWARD_ADDRESS TEXT    NOT NULL,
        FORWARD_TYPE    INT     NOT NULL,
        INIT_ON         INT     NOT NULL
     );
    `,
)