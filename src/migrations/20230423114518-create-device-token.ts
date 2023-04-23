import Sequel, { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.createTable('device-tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        unique: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      token: {
        unique: false,
        allowNull: true,
        defaultValue: null,
        type: Sequel.STRING,
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
    await queryInterface.dropTable('device-tokens');
  },
};
