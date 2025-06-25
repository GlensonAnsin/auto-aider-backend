import { User, Vehicle, VehicleDiagnostic, MechanicRequest } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET USER INFO
export const getUserInfo = async (req, res) => {
    const { id } = req.body;

    try {
        const userDetail = await User.findOne({ where: { user_id: id } });
        const { password: _, ...userWithoutPassword } = userDetail.toJSON();
        res.json({
            message: 'Request successful',
            userWithoutPassword
        });

    } catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// SIGNUP
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

// LOGIN
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { mobile_num: username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { user_id: user.user_id },
            process.env.REFRESH_TOKEN,
            { expiresIn: '30d' }
        );

        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (e) {
        console.error('Login error: ', e.message);
        res.status(500).json({ error: 'Server error' });
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

        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1hr' }
        );

        res.json({ accessToken: newAccessToken });

    } catch (e) {
        console.error('Refresh error: ', e.message);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};