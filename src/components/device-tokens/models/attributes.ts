import { Model, ModelStatic } from 'sequelize';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type DeviceTokenAttribute = {
  id: string;
  userId: string;
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
