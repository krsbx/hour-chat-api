import { config as dotenvConfig } from 'dotenv';
import { ENVIRONMENT_TYPE } from '../shares/constant';

dotenvConfig();

export = {
  [ENVIRONMENT_TYPE.DEVELOPMENT]: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: 'postgres',
  },
  [ENVIRONMENT_TYPE.TEST]: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'postgres',
  },
  [ENVIRONMENT_TYPE.PRODUCTION]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
