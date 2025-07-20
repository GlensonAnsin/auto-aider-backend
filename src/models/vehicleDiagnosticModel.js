import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const VehicleDiagnostic = sequelize.define('vehicle_diagnostic', {
    vehicle_diagnostic_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicle_id: { type: DataTypes.BIGINT, allowNull: false },
    dtc: { type: DataTypes.STRING(10), allowNull: false },
    technical_description: { type: DataTypes.TEXT, allowNull: false },
    meaning: { type: DataTypes.TEXT, allowNull: false },
    possible_causes: { type: DataTypes.TEXT, allowNull: false },
    recommended_repair: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    scan_reference: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'vehicle_diagnostic',
    timestamps: false,
});

export default VehicleDiagnostic;