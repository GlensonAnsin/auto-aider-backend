import User from './userModel';
import Vehicle from './vehicleModel';
import VehicleDiagnostic from './vehicleDiagnosticModel';
import AutoRepairShop from './autoRepairShopModel';
import MechanicRequest from './mechanicRequestModel';

User.hasMany(Vehicle, { foreignKey: 'user_id' });
Vehicle.belongsTo(User, { foreignKey: 'user_id' });

Vehicle.hasMany(VehicleDiagnostic, { foreignKey: 'vehicle_id' });
VehicleDiagnostic.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

VehicleDiagnostic.hasMany(MechanicRequest, { foreignKey: 'vehicle_diagnostic_id' });
MechanicRequest.belongsTo(VehicleDiagnostic, { foreignKey: 'vehicle_diagnostic_id' });

AutoRepairShop.hasMany(MechanicRequest, { foreignKey: 'repair_shop_id' });
MechanicRequest.belongsTo(AutoRepairShop, { foreignKey: 'repair_shop_id' });

export { User, Vehicle, VehicleDiagnostic, AutoRepairShop, MechanicRequest };