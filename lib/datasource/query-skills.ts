import baseQuery from './base-query';

export default async (client: any): Promise<any> => baseQuery(
    client,
    'SELECT GROUP, PLAIN_WORDS, POS, FEATURES from SKILL',
);
