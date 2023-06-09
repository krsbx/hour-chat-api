declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;

    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_NAME: string;

    EMAIL_SERVICE: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;

    JWT_SECRET: string;
    CHAT_BASE_PATH: string;
    SALT_ROUND: number;
  }
}
