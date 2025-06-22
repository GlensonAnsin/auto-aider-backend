import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const MechanicRequest = sequelize.define('mechanic_request', {
    mechanic_request_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicle_diagnostic_id: { type: DataTypes.BIGINT, allowNull: false },
    repair_shop_id: { type: DataTypes.BIGINT, allowNull: false },
    repair_procedure: { type: DataTypes.TEXT, allowNull: false },
    request_datetime: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false },
}, {
    timestamps: false,
});

export default MechanicRequest;