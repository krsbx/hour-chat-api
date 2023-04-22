import { DataTypes as DT, Sequelize } from 'sequelize';
import { init } from '../components/users/models';

export default (sequelize: Sequelize, DataTypes: typeof DT) =>
  init(sequelize, DataTypes);
