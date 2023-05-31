import { DataTypes as DT, Model, Sequelize } from 'sequelize';
import { Database } from 'sequelize-db-type/helper';
import { CreateEmailAttribute, EmailAttribute, EmailModel } from './attributes';
import factory from '../../../shares/factory';
import postFactory from './postFactory';
import EmailFactory from './EmailFactory';

function init(sequelize: Sequelize, DataTypes: typeof DT) {
  class Email extends Model<EmailAttribute, CreateEmailAttribute> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Database) {
      // define association here
    }
  }

  Email.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sender: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      receiver: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      subject: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
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
      modelName: 'emails',
    }
  );

  const factored = factory(Email);
  postFactory(factored as never);

  EmailFactory.init(factored as never);

  return Email as unknown as EmailModel;
}

export default init;
