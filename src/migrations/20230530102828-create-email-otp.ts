import Sequel, { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.createTable('email-otps', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      userId: {
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.UUID,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      validUntil: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('email-otps');
  },
};
