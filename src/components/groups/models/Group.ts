import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import { CreateGroupAttribute, GroupAttribute, GroupModel } from './attributes';
import GroupFactory from './GroupFactory';
import factory from '../../../shares/factory';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Group extends Model<GroupAttribute, CreateGroupAttribute> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      // define association here
    }
  }

  Group.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      members: {
        allowNull: false,
        defaultValue: [],
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'groups',
    }
  );

  const factored = factory(Group);

  GroupFactory.init(factored as never);

  return Group as unknown as GroupModel;
};
