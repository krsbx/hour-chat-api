import { Model, ModelStatic } from 'sequelize';
import factory from '../../../shares/factory';

export type GroupAttribute = {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateGroupAttribute = CreateOptional<
  GroupAttribute,
  'id' | 'createdAt' | 'updatedAt'
>;

export type BaseGroupModel = Model<GroupAttribute, CreateGroupAttribute>;

export type GroupModel = ModelStatic<BaseGroupModel> & {
  factory: ReturnType<
    typeof factory<GroupAttribute, CreateGroupAttribute>
  >['factory'];
};
