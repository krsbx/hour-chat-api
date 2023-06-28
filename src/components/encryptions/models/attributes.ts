import { Model, ModelStatic } from 'sequelize';

export type EncryptionAttribute = {
  id: number;
  receiverId: string;
  senderId: string;
  type: HourChat.Types.ChatType;
  key: number[];
  iv: number[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEncryptionAttribute = CreateOptional<
  EncryptionAttribute,
  'id' | 'createdAt' | 'updatedAt'
>;

export type BaseEncryptionModel = Model<
  EncryptionAttribute,
  CreateEncryptionAttribute
>;

export type EncryptionModel = ModelStatic<BaseEncryptionModel>;
