import { Model, ModelStatic } from 'sequelize';
import { GeoJson, GeoJsons } from 'sequelize-db-type/types';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type UserLocationAttribute = {
  id: string;
  userId: string;
  location: GeoJsons['Point'] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserLocationAttribute = CreateOptional<
  UserLocationAttribute,
  'id' | 'createdAt' | 'updatedAt' | 'location'
> & {
  location: GeoJson | null;
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
