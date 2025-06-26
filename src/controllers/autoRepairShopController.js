import { AutoRepairShop } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// SIGNUP REPAIR SHOP
export const createRepairShop = async (req, res) => {
    const { owner_firstname, owner_lastname, gender, shop_name, mobile_num, password, email, services_offered, longitude, latitude, creation_date, profile_pic, shop_images, number_of_ratings, average_rating, approval_status, total_score  } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const repairShop = AutoRepairShop.create({
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
            total_score
        });

        res.status(201).json(repairShop);

    } catch (e) {
        res.status(400).json({ error: e.message });
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

// LOGIN REPAIR SHOP
export const loginRepairShop = async (req, res) => {
    const { username, password } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({ where: { mobile_num: username } });

        if (!repairShop) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, repairShop.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { repair_shop_id: repairShop.repair_shop_id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1h' }
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
    const { repair_shop_id, owner_firstname, owner_lastname, gender, shop_name, mobile_num, email } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['owner_firstname', 'owner_lastname', 'gender', 'shop_name', 'mobile_num', 'email'],
        });

        const updatedRepairShopInfo = await repairShop.update({
            owner_firstname: owner_firstname,
            owner_lastname: owner_lastname,
            gender: gender,
            shop_name: shop_name,
            mobile_num: mobile_num,
            email: email
        });

        res.status(201).json(updatedRepairShopInfo);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const changePass =  async (req, res) => {
    const { repair_shop_id, newPassword } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['password'],
        });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedPassword = await repairShop.update({
            password: hashedPassword
        });

        res.status(201).json(updatedPassword);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateServicesOffered = async (req, res) => {
    const { repair_shop_id, services_offered } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['services_offered'],
        });

        const updatedServicesOffered = await repairShop.update({
            services_offered: services_offered
        });

        res.status(201).json(updatedServicesOffered);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateProfilePic = async (req, res) => {
    const { repair_shop_id, profile_pic } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['profile_pic'],
        });

        const updatedProfilePic = await repairShop.update({
            profile_pic: profile_pic
        });

        res.status(201).json(updatedProfilePic);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateShopImages = async (req, res) => {
    const { repair_shop_id, shop_images } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['shop_images'],
        });

        const updatedShopImages = await repairShop.update({
            shop_images: shop_images
        });

        res.status(201).json(updatedShopImages);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateNumberOfRatings = async (req, res) => {
    const { repair_shop_id, rate } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['number_of_ratings'],
        });

        const updatedNumberOfRatings = await repairShop.update({
            number_of_ratings: number_of_ratings + rate
        });

        res.status(201).json(updatedNumberOfRatings);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateTotalScore = async (req, res) => {
    const { repair_shop_id, score } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['total_score'],
        });

        const updatedTotalScore = await repairShop.update({
            total_score: total_score + score
        });

        res.status(201).json(updatedTotalScore);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateAverageRating = async (req, res) => {
    const { repair_shop_id } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['number_of_ratings', 'average_rating', 'total_score'],
        });

        const updatedAverageRating = await repairShop.update({
            number_of_ratings: number_of_ratings,
            average_rating: total_score / number_of_ratings,
            total_score: total_score
        });

        res.status(201).json(updatedAverageRating);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const changeLocation = async (req, res) => {
    const { repair_shop_id, longitude, latitude } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['longitude', 'latitude'],
        });

        const updatedLocation = await repairShop.update({
            longitude: longitude,
            latitude: latitude
        });

        res.status(201).json(updatedLocation);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateApprovalStatus = async (req, res) => {
    const { repair_shop_id, update } = req.body;

    try {
        const repairShop = await AutoRepairShop.findOne({
            where: { repair_shop_id: repair_shop_id },
            attributes: ['approval_status'],
        });

        const updatedApprovalStatus = await repairShop.update({
            approval_status: update
        });

        res.status(201).json(updatedApprovalStatus);

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
            { expiresIn: '1hr' }
        );

        res.json({ accessToken: newAccessToken });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};