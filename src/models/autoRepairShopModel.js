import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const AutoRepairShop = sequelize.define('auto_repair_shop', {
    repair_shop_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    owner_firstname: { type: DataTypes.STRING(50), allowNull: false },
    owner_lastname: { type: DataTypes.STRING(50), allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    shop_name: { type: DataTypes.STRING(255), allowNull: false },
    mobile_num: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true },
    services_offered: { type: DataTypes.TEXT, allowNull: false },
    longitude: { type: DataTypes.TEXT, allowNull: false },
    latitude: { type: DataTypes.TEXT, allowNull: false },
    creation_date: { type: DataTypes.DATEONLY },
    profile_pic: { type: DataTypes.TEXT },
    shop_images: { type: DataTypes.TEXT },
    number_of_ratings: { type: DataTypes.INTEGER },
    total_score: { type: DataTypes.INTEGER },
    average_rating: { type: DataTypes.DECIMAL },
    approval_status: { type: DataTypes.STRING(20) },
}, {
    timestamps: false,
});

export default AutoRepairShop;