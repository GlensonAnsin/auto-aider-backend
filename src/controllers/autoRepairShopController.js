import { AutoRepairShop } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const getAllRepairShops = async (req, res) => {
    try {
        const repairShops = await AutoRepairShop.findAll();
        res.json(repairShops);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const createRepairShop = async (req, res) => {
    try {
        const { owner_firstname, owner_lastname, gender, shop_name, mobile_num, password, email, services_offered, longitude, latitude, creation_date, profile_pic, shop_images, number_of_ratings, average_rating, approval_status, total_score  } = req.body;

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