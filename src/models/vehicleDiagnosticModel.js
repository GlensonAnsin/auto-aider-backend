import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const VehicleDiagnostic = sequelize.define('vehicle_diagnostic', {
    vehicle_diagnostic_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    vehicle_id: { type: DataTypes.BIGINT, allowNull: false },
    dtc: { type: DataTypes.STRING(10) },
    technical_description: { type: DataTypes.TEXT },
    meaning: { type: DataTypes.TEXT },
    possible_causes: { type: DataTypes.TEXT },
    recommended_repair: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, allowNull: false },
    scan_reference: { type: DataTypes.STRING, allowNull: false },
    vehicle_issue_description: { type: DataTypes.STRING },
}, {
    tableName: 'vehicle_diagnostic',
    timestamps: false,
});

export default VehicleDiagnostic;