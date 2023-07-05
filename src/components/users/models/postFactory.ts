import _ from 'lodash';
import { omit } from '../../../shares/common';
// eslint-disable-next-line import/no-cycle
import { BaseUserModel, UserAttribute, UserModel } from './attributes';
import { hashText } from '../utils/bcrypt';

function postFactory(factoryModel: UserModel) {
  async function modelToResource<
    TModel extends BaseUserModel,
    TResource extends Omit<UserAttribute, 'password' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return omit(resource, ['password', 'updatedAt']) as TResource;
  }

  async function resourceToModel<TResource extends UnknownObject>(
    resource: TResource | UserAttribute
  ) {
    const model = _.pick(resource, [
      'firstName',
      'middleName',
      'lastName',
      'username',
      'email',
      'phoneNumber',
      'password',
      'dob',
      'avatar',
    ]);

    if ((model as UserAttribute).password) {
      (model as UserAttribute).password = await hashText(
        (model as UserAttribute).password
      );
    }

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
