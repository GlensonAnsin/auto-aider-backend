import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const User = sequelize.define('user', {
  user_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  firstname: { type: DataTypes.STRING(50), allowNull: false },
  lastname: { type: DataTypes.STRING(50), allowNull: false },
  gender: { type: DataTypes.STRING(10), allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true },
  mobile_num: { type: DataTypes.STRING(20), unique: true, allowNull: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  creation_date: { type: DataTypes.DATEONLY, allowNull: false },
  profile_pic: { type: DataTypes.TEXT },
  role: { type: DataTypes.STRING(20), allowNull: false },
  user_initials_bg: { type: DataTypes.STRING(7), allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
  tableName: 'user',
  timestamps: false,
});

export default User;