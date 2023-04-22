import { Model, ModelStatic } from 'sequelize';
import { CreateOptional } from '../../../types/utils';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type UserAttribute = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserAttribute = CreateOptional<
  UserAttribute,
  'id' | 'middleName' | 'lastName' | 'createdAt' | 'updatedAt'
>;

export type BaseUserModel = Model<UserAttribute, CreateUserAttribute>;

export type UserModel = ModelStatic<BaseUserModel> & {
  factory: ReturnType<
    typeof factory<UserAttribute, CreateUserAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
