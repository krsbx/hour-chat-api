import { Model, ModelStatic } from 'sequelize';
import { GeoJson, GeoJsons } from 'sequelize-db-type/types';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type UserLocationAttribute = {
  id: number;
  userId: number;
  location: GeoJsons['Point'];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserLocationAttribute = CreateOptional<
  UserLocationAttribute,
  'id' | 'createdAt' | 'updatedAt' | 'location'
> & {
  location: GeoJson;
};

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
