import { AutoRepairShop, User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// SIGNUP
export const createUser = async (req, res) => {
  const {
    firstname,
    lastname,
    gender,
    email,
    mobile_num,
    password,
    creation_date,
    profile_pic,
    role,
    user_initials_bg,
    is_deleted,
    longitude,
    latitude,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstname,
      lastname,
      gender,
      email,
      mobile_num,
      password: hashedPassword,
      creation_date,
      profile_pic,
      role,
      user_initials_bg,
      is_deleted,
      longitude,
      latitude
    });

    res.sendStatus(201);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET USER INFO
export const getUserInfo = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const userDetail = await User.findOne({ where: { user_id: user_id } });
    res.status(200).json(userDetail);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET USER INFO FOR CHAT
export const getUserInfoForChat = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { user_id } = req.params;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const userInfo = await User.findOne({ where: { user_id: user_id } });
      res.status(200).json(userInfo);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// USER LOGIN
export const loginUser = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const user = await User.findOne({ where: { mobile_num: username, role: 'Car Owner' } });

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
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.REFRESH_TOKEN,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const user = await User.findOne({ where: { mobile_num: username, role: 'Admin' } });

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
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.REFRESH_TOKEN,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// UPDATE USER INFO
export const updateUserInfo = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    firstname,
    lastname,
    gender,
    email,
    mobile_num,
    profile_pic,
    field
  } = req.body;

  try {
    const user = await User.findOne({ where: { user_id } });
    let updateData = {};

    switch (field) {
      case 'firstname':
        updateData.firstname = firstname;
        break;
      case 'lastname':
        updateData.lastname = lastname;
        break;
      case 'gender':
        updateData.gender = gender;
        break;
      case 'email':
        updateData.email = email;
        break;
      case 'mobile-num':
        updateData.mobile_num = mobile_num;
        break;
      case 'profile':
        updateData.profile_pic = profile_pic;
        break;
      default:
        return res.status(400).json({ error: 'Invalid update field.' });
    };

    await user.update(updateData);
    req.io.emit(`updatedUserInfo-CO-${user_id}`, { updatedUserInfo: user });
    return res.sendStatus(201);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const changePass = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    newPassword,
    currentPassword
  } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword
    });

    res.sendStatus(201);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// RESET PASSWORD
export const resetPassCO = async (req, res) => {
  const {
    number,
    email,
    authType,
    newPassword,
  } = req.body;

  try {
    if (authType === 'sms') {
      const user = await User.findOne({ where: { mobile_num: number } });
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        password: hashedPassword
      });

      res.sendStatus(201);
    } else {
      const user = await User.findOne({ where: { email: email } });
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        password: hashedPassword
      });

      res.sendStatus(201);
    }
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

    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// CHECK EXISTENCE OF NUMBER OR EMAIL
export const checkNumOrEmailCO = async (req, res) => {
  const {
    number,
    email,
    authType,
  } = req.body;

  try {
    if (authType === 'sms') {
      const user = await User.findOne({ where: { mobile_num: number } });
      if (!user) {
        res.status(200).json({
          isExist: false,
        });
      } else {
        res.status(200).json({
          isExist: true,
        });
      }
    } else {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        res.status(200).json({
          isExist: false,
        });
      } else {
        res.status(200).json({
          isExist: true,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};