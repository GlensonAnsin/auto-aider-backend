import User from './userModel.js';
import Vehicle from './vehicleModel.js';
import VehicleDiagnostic from './vehicleDiagnosticModel.js';
import AutoRepairShop from './autoRepairShopModel.js';
import MechanicRequest from './mechanicRequestModel.js';

User.hasMany(Vehicle, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Vehicle.belongsTo(User, { foreignKey: 'user_id' });

Vehicle.hasMany(VehicleDiagnostic, { foreignKey: 'vehicle_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
VehicleDiagnostic.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

VehicleDiagnostic.hasMany(MechanicRequest, { foreignKey: 'vehicle_diagnostic_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
MechanicRequest.belongsTo(VehicleDiagnostic, { foreignKey: 'vehicle_diagnostic_id' });

AutoRepairShop.hasMany(MechanicRequest, { foreignKey: 'repair_shop_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
MechanicRequest.belongsTo(AutoRepairShop, { foreignKey: 'repair_shop_id' });

export { User, Vehicle, VehicleDiagnostic, AutoRepairShop, MechanicRequest };