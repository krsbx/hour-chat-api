export type EncryptionConfig = {
  [version: number]: {
    ENCRYPT_KEY: number[];
    ENCRYPT_IV: number[];
  };
};

export type EncryptionPayload = {
  senderId: string;
  receiverId: string;
  type: HourChat.Types.EncryptionType;
};
