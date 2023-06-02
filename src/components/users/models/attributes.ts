import { Model, ModelStatic } from 'sequelize';
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
  isEmailVerified: boolean;
  gender: string;
  dob: string | Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserAttribute = CreateOptional<
  UserAttribute,
  | 'id'
  | 'middleName'
  | 'lastName'
  | 'createdAt'
  | 'updatedAt'
  | 'isEmailVerified'
  | 'gender'
  | 'dob'
>;

export type BaseUserModel = Model<UserAttribute, CreateUserAttribute>;

export type UserModel = ModelStatic<BaseUserModel> & {
  factory: ReturnType<
    typeof factory<UserAttribute, CreateUserAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
