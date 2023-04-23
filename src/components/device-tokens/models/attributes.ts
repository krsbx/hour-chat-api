import { Model, ModelStatic } from 'sequelize';
import { CreateOptional } from '../../../types/utils';
import factory from '../../../shares/factory';
import postFactory from './postFactory';

export type DeviceTokenAttribute = {
  id: number;
  userId: number;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDeviceTokenAttribute = CreateOptional<
  DeviceTokenAttribute,
  'id' | 'token' | 'createdAt' | 'updatedAt'
>;

export type BaseDeviceTokenModel = Model<
  DeviceTokenAttribute,
  CreateDeviceTokenAttribute
>;

export type DeviceTokenModel = ModelStatic<BaseDeviceTokenModel> & {
  factory: ReturnType<
    typeof factory<DeviceTokenAttribute, CreateDeviceTokenAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
