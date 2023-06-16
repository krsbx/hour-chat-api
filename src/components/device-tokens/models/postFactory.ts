import _ from 'lodash';
import { omit } from '../../../shares/common';
// eslint-disable-next-line import/no-cycle
import {
  BaseDeviceTokenModel,
  DeviceTokenAttribute,
  DeviceTokenModel,
} from './attributes';

function postFactory(factoryModel: DeviceTokenModel) {
  async function modelToResource<
    TModel extends BaseDeviceTokenModel,
    TResource extends Omit<DeviceTokenAttribute, 'createdAt' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return omit(resource, ['createdAt', 'updatedAt']) as TResource;
  }

  async function resourceToModel<TResource extends UnknownObject>(
    resource: TResource | DeviceTokenAttribute
  ) {
    const model = _.pick(resource, ['userId', 'token']);

    return model;
  }

  Object.assign(factoryModel.factory, {
    modelToResource,
    resourceToModel,
  });

  return {
    modelToResource,
    resourceToModel,
  };
}

export default postFactory;
