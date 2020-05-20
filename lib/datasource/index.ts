import { Client } from 'pg';

/*
user: 'dbuser',
host: 'database.server.com',
database: 'mydb',
password: 'secretpassword',
port: 3211,
*/

export default (): any => {
    return new Client();
}
