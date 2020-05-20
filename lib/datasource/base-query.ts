export default async (client: any, query: string): Promise<any> => {
    client.connect()

    return new Promise((promiseRes: any, rej: any) => {
        client.query(query, (err: any, res: any) => {
            (err) ? rej(err) : promiseRes(res);

            client.end()
        })
    });
}
