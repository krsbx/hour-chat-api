import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import {
  CreateEmailOtpAttribute,
  EmailOtpAttribute,
  EmailOtpModel,
} from './attributes';
import factory from '../../../shares/factory';
import postFactory from './postFactory';
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
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: DataTypes.UUID,
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

  const factored = factory(EmailOtp);
  postFactory(factored as never);

  EmailOtpFactory.init(factored as never);

  return EmailOtp as unknown as EmailOtpModel;
};
