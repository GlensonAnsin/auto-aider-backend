import { AutoRepairShop, User, SavePushToken, Notification, MechanicRequest } from '../models/index.js';
import { sendPushToTokens } from "../utils/pushNotif.js";
import dayjs from 'dayjs';
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
    res.status(200).json(repairShops);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL UNAPPROVED REPAIR SHOPS (ADMIN)
export const getAllUnAppShops = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id, role: 'Admin' } });

    if (user) {
      const shops = await AutoRepairShop.findAll({ where: { approval_status: 'Pending' } });
      res.status(200).json(shops);
    }
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

// GET REPAIR SHOP INFO FOR CHAT
export const getShopInfoForChat = async (req, res) => {
  const user_id = req.user.user_id;
  const { repair_shop_id } = req.params

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const shopInfo = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });
      res.status(200).json(shopInfo);
    }
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
    req.io.emit(`updatedRepairShopInfo-RS-${repair_shop_id}`, { updatedRepairShopInfo: repairShop });
    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const updateRatings = async (req, res) => {
  const user_id = req.user.user_id
  const {
    shopID,
    requestID,
    score,
  } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const repairShop = await AutoRepairShop.findOne({ where: { repair_shop_id: shopID } });

      await repairShop.update({
        number_of_ratings: repairShop.number_of_ratings + 1,
        average_rating: (repairShop.total_score + score) / (repairShop.number_of_ratings + 1),
        total_score: repairShop.total_score + score
      });

      const tokens = await SavePushToken.findAll({ where: { repair_shop_id: shopID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'You Got a New Rating',
        body: `${user.firstname} ${user.lastname} gave your shop a ${score}-star rating.`,
        data: {},
      });

      const newNotif = await Notification.create({
        user_id: null,
        repair_shop_id: shopID,
        title: 'You Got a New Rating',
        message: `${user.firstname} ${user.lastname} gave your shop a ${score}-star rating.`,
        is_read: false,
        created_at: dayjs().format(),
      });

      req.io.emit(`newNotif-RS-${shopID}`, { newNotif });

      for (const id of requestID) {
        const request = await MechanicRequest.findOne({ where: { mechanic_request_id: id } });
        await request.update({
          is_rated: true,
          score: score,
        });
      }

      res.sendStatus(201);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateAvailability = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { availability } = req.body;
  console.log(availability);

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    await shop.update({
      availability: availability ? 'close' : 'open',
    });
    
    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

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

// RESET PASSWORD
export const resetPassRS = async (req, res) => {
  const {
    number,
    email,
    authType,
    newPassword,
  } = req.body;

  try {
    if (authType === 'sms') {
      const shop = await AutoRepairShop.findOne({ where: { mobile_num: number } });
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await shop.update({
        password: hashedPassword
      });

      res.sendStatus(201);
    } else {
      const shop = await AutoRepairShop.findOne({ where: { email: email } });
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await shop.update({
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

// CHECK EXISTENCE OF NUMBER OR EMAIL
export const checkNumOrEmailRS = async (req, res) => {
  const {
    number,
    email,
    authType,
  } = req.body;

  try {
    if (authType === 'sms') {
      const shop = await AutoRepairShop.findOne({ where: { mobile_num: number } });
      if (!shop) {
        res.status(200).json({
          isExist: false,
        });
      } else {
        res.status(200).json({
          isExist: true,
        });
      }
    } else {
      const shop = await AutoRepairShop.findOne({ where: { email: email } });
      if (!shop) {
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