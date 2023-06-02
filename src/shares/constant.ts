import path from 'path';

export const ROOT_PATH = path.join(__dirname, '../../');
export const ASSETS_PATH = path.join(ROOT_PATH, 'assets');

export const ENV_NAMES = [
  'PORT',
  'DB_USER',
  'DB_TYPE',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_SCHEMA',
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
