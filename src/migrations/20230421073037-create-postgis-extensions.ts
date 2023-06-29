import Sequel, { QueryInterface } from 'sequelize';

const EXTENSIONS = [
  'postgis',
  'fuzzystrmatch',
  'postgis_tiger_geocoder',
  'postgis_topology',
];

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS postgis`,
      {
        raw: true,
      }
    );
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof Sequel) {
    await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS postgis`, {
      raw: true,
    });
  },
};
