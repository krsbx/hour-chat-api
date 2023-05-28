import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import factory from '../../../shares/factory';
import { CreateUserAttribute, UserAttribute, UserModel } from './attributes';
import UserFactory from './UserFactory';
import postFactory from './postFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class User extends Model<UserAttribute, CreateUserAttribute> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      User.hasOne(models['user-locations'], {
        foreignKey: 'userId',
        as: 'userLocation',
      });

      User.hasMany(models['device-tokens'], {
        foreignKey: 'userId',
        as: 'deviceToken',
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      middleName: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
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
      modelName: 'users',
    }
  );

  const factored = factory(User);
  postFactory(User as never);

  UserFactory.init(factored as never);

  return User as unknown as UserModel;
}

export default init;
