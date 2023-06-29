import Sequel, { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.createTable('stories', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      body: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      file: {
        allowNull: true,
        type: Sequelize.JSON,
        defaultValue: {},
      },
      userId: {
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('stories');
  },
};
