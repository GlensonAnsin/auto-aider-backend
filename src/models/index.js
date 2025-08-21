import User from './userModel.js';
import Vehicle from './vehicleModel.js';
import VehicleDiagnostic from './vehicleDiagnosticModel.js';
import AutoRepairShop from './autoRepairShopModel.js';
import MechanicRequest from './mechanicRequestModel.js';
import ChatMessage from './chatMessageModel.js';
import Notification from './notificationModel.js';

User.hasMany(Vehicle, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Vehicle.belongsTo(User, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

User.hasMany(ChatMessage, { foreignKey: 'sender_user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

User.hasMany(ChatMessage, { foreignKey: 'receiver_user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
ChatMessage.belongsTo(User, { foreignKey: 'receiver_user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

User.hasMany(Notification, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

Vehicle.hasMany(VehicleDiagnostic, { foreignKey: 'vehicle_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
VehicleDiagnostic.belongsTo(Vehicle, { foreignKey: 'vehicle_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

VehicleDiagnostic.hasMany(MechanicRequest, { foreignKey: 'vehicle_diagnostic_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
MechanicRequest.belongsTo(VehicleDiagnostic, { foreignKey: 'vehicle_diagnostic_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

AutoRepairShop.hasMany(MechanicRequest, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
MechanicRequest.belongsTo(AutoRepairShop, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

AutoRepairShop.hasMany(ChatMessage, { foreignKey: 'sender_repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
ChatMessage.belongsTo(AutoRepairShop, { foreignKey: 'sender_repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

AutoRepairShop.hasMany(ChatMessage, { foreignKey: 'receiver_repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
ChatMessage.belongsTo(AutoRepairShop, { foreignKey: 'receiver_repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

AutoRepairShop.hasMany(Notification, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Notification.belongsTo(AutoRepairShop, { foreignKey: 'repair_shop_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

export { User, Vehicle, VehicleDiagnostic, AutoRepairShop, MechanicRequest, ChatMessage, Notification };