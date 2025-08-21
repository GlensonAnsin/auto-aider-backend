import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const Notification = sequelize.define('notification', {
  notification_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT },
  repair_shop_id: { type: DataTypes.BIGINT },
  title: { type: DataTypes.STRING(100), allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'notification',
  timestamps: false,
});

export default Notification;