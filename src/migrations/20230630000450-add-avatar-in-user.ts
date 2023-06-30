import Sequel, { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.addColumn('users', 'avatar', {
      defaultValue: null,
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    queryInterface.removeColumn('users', 'avatar');
  },
};
