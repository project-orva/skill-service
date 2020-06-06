
import * as dotenv from 'dotenv';

export default () => {
    dotenv.config();
    dotenv.config({ path: `${__dirname}/../../../.env` });
};