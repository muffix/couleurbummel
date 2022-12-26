import dotenv from 'dotenv';
import path from 'path';

const configFromEnv = dotenv.config({
  path: path.resolve(__dirname, '../.env.test'),
});

export default configFromEnv;
