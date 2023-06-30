import { Model, ModelStatic } from 'sequelize';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type UserAttribute = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  password: string;
  isEmailVerified: boolean;
  gender: string | null;
  dob: string | Date;
  avatar: string | null;
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
