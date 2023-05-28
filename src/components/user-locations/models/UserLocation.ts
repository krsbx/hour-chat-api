import { Sequelize, DataTypes as DT, Model } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import {
  CreateUserLocationAttribute,
  UserLocationAttribute,
  UserLocationModel,
} from './attributes';
import UserLocationFactory from './UserLocationFactory';
import factory from '../../../shares/factory';
import postFactory from './postFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class UserLocation extends Model<
    UserLocationAttribute,
    CreateUserLocationAttribute
  > {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      UserLocation.belongsTo(models.users, {
        onDelete: 'CASCADE',
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  UserLocation.init(
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
      location: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.GEOMETRY('POINT', 4326),
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
      modelName: 'user-locations',
    }
  );

  const factored = factory(UserLocation);
  postFactory(UserLocation as never);

  UserLocationFactory.init(factored as never);

  return UserLocation as unknown as UserLocationModel;
}

export default init;
