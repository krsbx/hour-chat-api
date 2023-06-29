import Sequel, { QueryInterface } from 'sequelize';
import { GENDER } from '../shares/constant';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      middleName: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        defaultValue: GENDER.OTHER,
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE,
      },
      isEmailVerified: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.dropTable('users');
  },
};
