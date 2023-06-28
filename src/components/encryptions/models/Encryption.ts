import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import {
  EncryptionAttribute,
  CreateEncryptionAttribute,
  EncryptionModel,
} from './attributes';
import EncryptionFactory from './EncryptionFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class Encryption extends Model<
    EncryptionAttribute,
    CreateEncryptionAttribute
  > {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {}
  }

  Encryption.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      receiverId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      senderId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      key: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      iv: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER),
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
      modelName: 'encryptions',
    }
  );

  EncryptionFactory.init(Encryption as never);

  return Encryption as unknown as EncryptionModel;
}

export default init;
