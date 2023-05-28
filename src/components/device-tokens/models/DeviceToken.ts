import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import {
  CreateDeviceTokenAttribute,
  DeviceTokenAttribute,
  DeviceTokenModel,
} from './attributes';
import factory from '../../../shares/factory';
import postFactory from './postFactory';
import DeviceTokenFactory from './DeviceTokenFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class DeviceToken extends Model<
    DeviceTokenAttribute,
    CreateDeviceTokenAttribute
  > {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      DeviceToken.belongsTo(models.users, {
        onDelete: 'CASCADE',
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  DeviceToken.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        unique: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
      },
      token: {
        unique: false,
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
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
      modelName: 'device-tokens',
    }
  );

  const factored = factory(DeviceToken);
  postFactory(DeviceToken as never);

  DeviceTokenFactory.init(factored as never);

  return DeviceToken as unknown as DeviceTokenModel;
}

export default init;
