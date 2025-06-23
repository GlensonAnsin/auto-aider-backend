import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { firstname, lastname, gender, email, mobile_num, password, creation_date, profile_pic, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            gender,
            email,
            mobile_num,
            password: hashedPassword,
            creation_date,
            profile_pic,
            role
        });
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};