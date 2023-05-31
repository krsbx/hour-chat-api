import _ from 'lodash';
import { omit } from '../../../shares/common';
// eslint-disable-next-line import/no-cycle
import {
  BaseEmailOtpModel,
  EmailOtpAttribute,
  EmailOtpModel,
} from './attributes';

function postFactory(factoryModel: EmailOtpModel) {
  async function modelToResource<
    TModel extends BaseEmailOtpModel,
    TResource extends Omit<EmailOtpAttribute, 'createdAt' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return omit(resource, ['createdAt', 'updatedAt']) as TResource;
  }

  async function resourceToModel<TResource extends NonNullable<unknown>>(
    resource: TResource | EmailOtpAttribute
  ) {
    const model = _.pick(resource, ['userId', 'code', 'validUntil']);

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
