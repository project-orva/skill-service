import { Client } from 'pg';

export default async (query: string): Promise<any> => {
    const client = new Client();

    client.connect()

    console.log('executing query', query)

    return new Promise((promiseRes: any, rej: any) => {
        client.query(query, (err: any, res: any) => {
            (err) ? rej(err) : promiseRes(res.rows);

            client.end()
        })
    });
}
