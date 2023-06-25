import _ from 'lodash';
// eslint-disable-next-line import/no-cycle
import { BaseStoryModel, StoryAttribute, StoryModel } from './attributes';

function postFactory(factoryModel: StoryModel) {
  async function modelToResource<
    TModel extends BaseStoryModel,
    TResource extends Omit<StoryAttribute, 'password' | 'updatedAt'>
  >(model: TModel) {
    const resource = model.toJSON?.();

    return resource as unknown as TResource;
  }

  async function resourceToModel<TResource extends UnknownObject>(
    resource: TResource | StoryAttribute
  ) {
    const model = _.pick(resource, ['userId', 'body', 'file']);

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
