import { DataTypes as DT, Model, ModelStatic } from 'sequelize';
import { CreateOptional } from '../../../types/utils';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type UserLocationAttribute = {
  id: number;
  userId: number;
  location: DT.GeometryDataType;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserLocationAttribute = CreateOptional<
  UserLocationAttribute,
  'id' | 'createdAt' | 'updatedAt' | 'location'
>;

export type BaseUserLocationModel = Model<
  UserLocationAttribute,
  CreateUserLocationAttribute
>;

export type UserLocationModel = ModelStatic<BaseUserLocationModel> & {
  factory: ReturnType<
    typeof factory<UserLocationAttribute, CreateUserLocationAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
