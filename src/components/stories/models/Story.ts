import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import { StoryAttribute, CreateStoryAttribute, StoryModel } from './attributes';
import StoryFactory from './StoryFactory';
import factory from '../../../shares/factory';
import postFactory from './postFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class Story extends Model<StoryAttribute, CreateStoryAttribute> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      Story.belongsTo(models.users, {
        onDelete: 'CASCADE',
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Story.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      body: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null,
      },
      file: {
        allowNull: true,
        type: DataTypes.JSON,
        defaultValue: {},
      },
      userId: {
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: DataTypes.UUID,
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
      modelName: 'stories',
    }
  );

  const factored = factory(Story);
  postFactory(Story as never);

  StoryFactory.init(factored as never);

  return Story as unknown as StoryModel;
}

export default init;
