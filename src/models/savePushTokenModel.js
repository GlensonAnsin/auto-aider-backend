import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const SavePushToken = sequelize.define('save_push_token', {
  push_token_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT },
  repair_shop_id: { type: DataTypes.BIGINT },
  platform: { type: DataTypes.STRING(20), allowNull: false },
  updated_at: { type: DataTypes.DATE, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'save_push_token',
  timestamps: false,
});

export default SavePushToken;