import { Model, ModelStatic } from 'sequelize';
import { CreateOptional } from '../../../types/utils';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

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

export type EmailOtpModel = ModelStatic<BaseEmailOtpModel> & {
  factory: ReturnType<
    typeof factory<EmailOtpAttribute, CreateEmailOtpAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
