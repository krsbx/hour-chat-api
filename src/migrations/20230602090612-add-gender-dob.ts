import Sequel, { QueryInterface } from 'sequelize';
import { GENDER } from '../shares/constant';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await Promise.all([
      queryInterface.addColumn('users', 'gender', {
        defaultValue: GENDER.OTHER,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('users', 'dob', {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE,
      }),
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await Promise.all([
      queryInterface.removeColumn('users', 'gender'),
      queryInterface.removeColumn('users', 'dob'),
    ]);
  },
};
