import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import {
  CreateEmailOtpAttribute,
  EmailOtpAttribute,
  EmailOtpModel,
} from './attributes';
import EmailOtpFactory from './EmailOtpFactory';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class EmailOtp extends Model<EmailOtpAttribute, CreateEmailOtpAttribute> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      EmailOtp.belongsTo(models.users, {
        onDelete: 'CASCADE',
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  EmailOtp.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      validUntil: {
        allowNull: false,
        type: DataTypes.DATE,
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
      modelName: 'email-otps',
    }
  );

  EmailOtpFactory.init(EmailOtpFactory as never);

  return EmailOtp as unknown as EmailOtpModel;
};
