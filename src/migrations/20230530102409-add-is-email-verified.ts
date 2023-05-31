import Sequel, { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.addColumn('users', 'isEmailVerified', {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.removeColumn('users', 'isEmailVerified');
  },
};
