import { Model, ModelStatic } from 'sequelize';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type EmailAttribute = {
  id: string;
  sender: string;
  receiver: string;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmailAttribute = CreateOptional<
  EmailAttribute,
  'id' | 'createdAt' | 'updatedAt'
>;

export type BaseEmailModel = Model<EmailAttribute, CreateEmailAttribute>;

export type EmailModel = ModelStatic<BaseEmailModel> & {
  factory: ReturnType<
    typeof factory<EmailAttribute, CreateEmailAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
