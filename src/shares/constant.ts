import _ from 'lodash';
import path from 'path';

export const ROOT_PATH = path.join(__dirname, '../../');
export const ASSETS_PATH = path.join(ROOT_PATH, 'assets');

export const ENVIRONMENT_TYPE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export const ENVIRONMENT_NAME = {
  [ENVIRONMENT_TYPE.DEVELOPMENT]: {
    DB_USER: 'DB_USER_DEV',
    DB_PASSWORD: 'DB_PASSWORD_DEV',
    DB_HOST: 'DB_HOST_DEV',
    DB_NAME: 'DB_NAME_DEV',
    JWT_SECRET: 'JWT_SECRET_DEV',
    SALT_ROUND: 'SALT_ROUND_DEV',
    CHAT_BASE_PATH: 'CHAT_BASE_PATH_DEV',
    PORT: 'PORT_DEV',
  },
  [ENVIRONMENT_TYPE.PRODUCTION]: {
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_HOST: 'DB_HOST',
    DB_NAME: 'DB_NAME',
    JWT_SECRET: 'JWT_SECRET',
    SALT_ROUND: 'SALT_ROUND',
    CHAT_BASE_PATH: 'CHAT_BASE_PATH',
    PORT: 'PORT',
  },
  [ENVIRONMENT_TYPE.TEST]: {
    DB_USER: 'DB_USER_TEST',
    DB_PASSWORD: 'DB_PASSWORD_TEST',
    DB_HOST: 'DB_HOST_TEST',
    DB_NAME: 'DB_NAME_TEST',
    JWT_SECRET: 'JWT_SECRET_TEST',
    SALT_ROUND: 'SALT_ROUND_TEST',
    CHAT_BASE_PATH: 'CHAT_BASE_PATH_TEST',
    PORT: 'PORT_TEST',
  },
};

export const ENV_NAMES = [
  ..._.reduce(
    ENVIRONMENT_NAME,
    (prev, curr) => {
      prev.push(..._.values(curr));

      return prev;
    },
    [] as string[]
  ),
  'ENCRYPT_KEY',
  'ENCRYPT_IV',
  'EMAIL_SERVICE',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];
