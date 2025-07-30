import User from './userModel.js';
import Vehicle from './vehicleModel.js';
import VehicleDiagnostic from './vehicleDiagnosticModel.js';
import AutoRepairShop from './autoRepairShopModel.js';
import MechanicRequest from './mechanicRequestModel.js';

User.hasMany(Vehicle, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
Vehicle.belongsTo(User, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

Vehicle.hasMany(VehicleDiagnostic, { foreignKey: 'vehicle_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
VehicleDiagnostic.belongsTo(Vehicle, { foreignKey: 'vehicle_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

VehicleDiagnostic.hasMany(MechanicRequest, { foreignKey: 'vehicle_diagnostic_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
MechanicRequest.belongsTo(VehicleDiagnostic, { foreignKey: 'vehicle_diagnostic_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

AutoRepairShop.hasMany(MechanicRequest, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
MechanicRequest.belongsTo(AutoRepairShop, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });

export { User, Vehicle, VehicleDiagnostic, AutoRepairShop, MechanicRequest };