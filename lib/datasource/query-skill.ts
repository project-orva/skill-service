import baseQuery from './base-query';

export default async (client: any, variables: any): Promise<any> => baseQuery(
    client,
    `SELECT FORWARD_ADDRESS WHERE ID='${variables.id}' from SKILL`,
);
