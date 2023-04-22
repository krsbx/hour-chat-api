import { DataTypes as DT, Sequelize } from 'sequelize';
import { init } from '../components/user-locations/models';

export default (sequelize: Sequelize, DataTypes: typeof DT) =>
  init(sequelize, DataTypes);
