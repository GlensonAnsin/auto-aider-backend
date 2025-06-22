import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const Vehicle = sequelize.define('vehicle', {
    vehicle_id: { type: DataType.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    make: { type: DataTypes.STRING(50), allowNull: false },
    model: { type: DataTypes.STRING(50), allowNull: false },
    year: { type: DataTypes.STRING(4), allowNull: false },
}, {
    timestamps: false,
});

export default Vehicle;