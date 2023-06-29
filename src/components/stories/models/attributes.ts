import { Model, ModelStatic } from 'sequelize';
import factory from '../../../shares/factory';
// eslint-disable-next-line import/no-cycle
import postFactory from './postFactory';

export type StoryAttribute = {
  id: string;
  body?: string;
  file?: {
    uri: string;
    type?: string | null;
    width?: number;
    height?: number;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateStoryAttribute = CreateOptional<
  StoryAttribute,
  'id' | 'createdAt' | 'updatedAt'
>;

export type BaseStoryModel = Model<StoryAttribute, CreateStoryAttribute>;

export type StoryModel = ModelStatic<BaseStoryModel> & {
  factory: ReturnType<
    typeof factory<StoryAttribute, CreateStoryAttribute>
  >['factory'] &
    ReturnType<typeof postFactory>;
};
