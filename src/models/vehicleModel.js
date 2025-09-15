import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const Vehicle = sequelize.define('vehicle', {
  vehicle_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  make: { type: DataTypes.STRING(50), allowNull: false },
  model: { type: DataTypes.STRING(50), allowNull: false },
  year: { type: DataTypes.STRING(4), allowNull: false },
  date_added: { type: DataTypes.DATE, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false },
  last_pms_trigger: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'vehicle',
  timestamps: false,
});

export default Vehicle;