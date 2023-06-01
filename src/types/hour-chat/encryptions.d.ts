export type EncryptionConfig = {
  [version: number]: {
    ENCRYPT_KEY: number[];
    ENCRYPT_IV: number[];
  };
};
