import path from 'path';

export const ROOT_PATH = path.join(__dirname, '../../');
export const ASSETS_PATH = path.join(ROOT_PATH, 'assets');

export const ENV_NAMES = [
  'PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_NAME',
  'DB_USER_DEV',
  'DB_PASSWORD_DEV',
  'DB_HOST_DEV',
  'DB_NAME_DEV',
  'DB_USER_TEST',
  'DB_PASSWORD_TEST',
  'DB_HOST_TEST',
  'DB_NAME_TEST',
  'JWT_SECRET',
  'CHAT_BASE_PATH',
  'SALT_ROUND',
  'ENCRYPT_KEY',
  'ENCRYPT_IV',
  'EMAIL_SERVICE',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;
