import _ from 'lodash';
import { omit } from '../../../shares/common';
// eslint-disable-next-line import/no-cycle
import {
  BaseUserLocationModel,
  UserLocationAttribute,
  UserLocationModel,
} from './attributes';

function postFactory(factoryModel: UserLocationModel) {
  async function modelToResource<
    TModel extends BaseUserLocationModel,
    TResource extends Omit<UserLocationAttribute, 'password' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return omit(resource, ['createdAt', 'updatedAt']) as TResource;
  }

  async function resourceToModel<TResource extends NonNullable<unknown>>(
    resource: TResource | UserLocationAttribute
  ) {
    const model = _.pick(resource, ['userId', 'location']);

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
