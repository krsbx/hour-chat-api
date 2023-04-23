import { DataTypes as DT, Sequelize } from 'sequelize';
import init from '../components/device-tokens/models/DeviceToken';

export default (sequelize: Sequelize, DataTypes: typeof DT) =>
  init(sequelize, DataTypes);
