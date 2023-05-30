import { Model, ModelStatic } from 'sequelize';
import { CreateOptional } from '../../../types/utils';

export type EmailOtpAttribute = {
  id: number;
  userId: number;
  code: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmailOtpAttribute = CreateOptional<
  EmailOtpAttribute,
  'id' | 'createdAt' | 'updatedAt'
>;

export type BaseEmailOtpModel = Model<
  EmailOtpAttribute,
  CreateEmailOtpAttribute
>;

export type EmailOtpModel = ModelStatic<BaseEmailOtpModel>;
