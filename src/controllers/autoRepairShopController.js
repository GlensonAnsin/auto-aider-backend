import { AutoRepairShop } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// SIGNUP REPAIR SHOP
export const createRepairShop = async (req, res) => {
    const {
        owner_firstname,
        owner_lastname,
        gender,
        shop_name,
        mobile_num,
        password,
        email,
        services_offered,
        longitude,
        latitude,
        creation_date,
        profile_pic,
        shop_images,
        number_of_ratings,
        average_rating,
        approval_status,
        total_score,
        profile_bg,
        availability,
        is_deleted 
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await AutoRepairShop.create({
            owner_firstname,
            owner_lastname,
            gender,
            shop_name,
            mobile_num,
            password: hashedPassword,
            email,
            services_offered,
            longitude,
            latitude,
            creation_date,
            profile_pic,
            shop_images,
            number_of_ratings,
            average_rating,
            approval_status,
            total_score,
            profile_bg,
            availability,
            is_deleted,
        });
        
        res.sendStatus(201);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET ALL REPAIR SHOPS
export const getAllRepairShops = async (req, res) => {
    try {
        const repairShops = await AutoRepairShop.findAll();
        res.json(repairShops);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET REPAIR SHOP INFO
export const getRepairShopInfo = async (req, res) => {
    const repair_shop_id = req.user.repair_shop_id;

    try {
        const repairShopDetail = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });
        res.status(200).json(repairShopDetail);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// LOGIN REPAIR SHOP
export const loginRepairShop = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({ where: { mobile_num: username } });

        if (!repairShop) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (repairShop.approval_status === 'Pending') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, repairShop.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { repair_shop_id: repairShop.repair_shop_id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { repair_shop_id: repairShop.repair_shop_id },
            process.env.REFRESH_TOKEN,
            { expiresIn: '30d' }
        );

        const { password: _, ...repairShopWithoutPassword } = repairShop.toJSON();

        res.status(200).json({
            repairShop: repairShopWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// UPDATE REPAIR SHOP INFO
export const updateRepairShopInfo = async (req, res) => {
    const repair_shop_id = req.user.repair_shop_id;
    const {
        owner_firstname,
        owner_lastname,
        gender,
        shop_name,
        mobile_num,
        email,
        currentPassword,
        newPassword,
        services_offered,
        longitude,
        latitude,
        profile_pic,
        shop_images,
        field
    } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({ where: { repair_shop_id } });

        if (!repairShop) {
            return res.status(404).json({ error: 'Repair shop not found.' });
        }

        let updateData = {};

        switch (field) {
            case 'rep-shop-name':
                updateData.shop_name = shop_name;
                break;
            case 'firstname':
                updateData.owner_firstname = owner_firstname;
                break;
            case 'lastname':
                updateData.owner_lastname = owner_lastname;
                break;
            case 'gender':
                updateData.gender = gender;
                break;
            case 'mobile-num':
                updateData.mobile_num = mobile_num;
                break;
            case 'email':
                updateData.email = email;
                break;
            case 'change-password':
                const isMatch = await bcrypt.compare(currentPassword, repairShop.password);

                if (!isMatch) {
                    return res.status(401).json({ message: 'Wrong current password' });
                }

                updateData.password = await bcrypt.hash(newPassword, 10);
                break;
            case 'services-offered':
                updateData.services_offered = services_offered;
                break;
            case 'region':
                updateData.latitude = latitude;
                updateData.longitude = longitude;
                break;
            case 'profile':
                updateData.profile_pic = profile_pic;
                break;
            case 'shop-images':
                updateData.shop_images = shop_images;
                break;
            default:
                return res.status(400).json({ error: 'Invalid update field.' });
        }

        await repairShop.update(updateData);
        req.io.emit('updatedRepairShopInfo', { updatedRepairShopInfo: repairShop });
        return res.sendStatus(201);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

export const updateRatings = async (req, res) => {
    const repair_shop_id = req.user.repair_shop_id
    const {
        rate,
        score
    } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

        await repairShop.update({
            number_of_ratings: number_of_ratings + rate,
            average_rating: total_score / number_of_ratings,
            total_score: total_score + score
        });

        res.sendStatus(201);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateApprovalStatus = async (req, res) => {
    const {
        repair_shop_id,
        update
    } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['approval_status'],
        });

        await repairShop.update({
            approval_status: update
        });

        res.sendStatus(201);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// REFRESH TOKEN
export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN
        );

        const repairShop = await AutoRepairShop.findByPk(decoded.repair_shop_id);

        if (!repairShop) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { repair_shop_id: repairShop.repair_shop_id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1h' }
        );

        res.json({ accessToken: newAccessToken });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};