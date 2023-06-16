import _ from 'lodash';
import { omit } from '../../../shares/common';
// eslint-disable-next-line import/no-cycle
import { BaseEmailModel, EmailAttribute, EmailModel } from './attributes';

function postFactory(factoryModel: EmailModel) {
  async function modelToResource<
    TModel extends BaseEmailModel,
    TResource extends Omit<EmailAttribute, 'createdAt' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return omit(resource, ['createdAt', 'updatedAt']) as TResource;
  }

  async function resourceToModel<TResource extends UnknownObject>(
    resource: TResource | EmailAttribute
  ) {
    const model = _.pick(resource, [
      'sender',
      'receiver',
      'subject',
      'content',
    ]);

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
