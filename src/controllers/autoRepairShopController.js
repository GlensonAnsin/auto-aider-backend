import {
  AutoRepairShop,
  User,
  SavePushToken,
  Notification,
  MechanicRequest
} from '../models/index.js';
import { sendPushToTokens } from "../utils/pushNotif.js";
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

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
    is_deleted,
    settings_map_type,
    settings_push_notif,
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
      settings_map_type,
      settings_push_notif,
    });

    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL REPAIR SHOPS
export const getAllRepairShops = async (req, res) => {
  try {
    const repairShops = await AutoRepairShop.findAll({ where: { approval_status: 'Approved', is_deleted: false } });
    res.status(200).json(repairShops);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL REPAIR SHOPS (ADMIN)
export const getAllShopsForAdmin = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id, role: 'Admin' } });

    if (user) {
      const repairShops = await AutoRepairShop.findAll({ where: { is_deleted: false } });
      res.status(200).json(repairShops);
    }
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

// GET UNAPPROVED REPAIR SHOP INFO (ADMIN)
export const getUnAppShopInfo = async (req, res) => {
  const user_id = req.user.user_id;
  const { shop_id } = req.params;

  try {
    const user = await User.findOne({ where: { user_id: user_id, role: 'Admin' } });

    if (user) {
      const shopDetail = await AutoRepairShop.findOne({ where: { repair_shop_id: shop_id } });
      res.status(200).json(shopDetail);
    }
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
  const { username, password } = req.body;

  try {
    const repairShop = await AutoRepairShop.findOne({ where: { mobile_num: username , is_deleted: false} });

    if (!repairShop) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (repairShop.approval_status === 'Pending' || repairShop.approval_status === 'Rejected') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, repairShop.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { repair_shop_id: repairShop.repair_shop_id },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30d' }
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

      if (Boolean(repairShop.settings_push_notif)) {
        const tokens = await SavePushToken.findAll({ where: { repair_shop_id: shopID } });
        const tokenValues = tokens.map(t => t.token);

        await sendPushToTokens(tokenValues, {
          title: 'You Got a New Rating',
          body: `${user.firstname} ${user.lastname} gave your shop a ${score}-star rating.`,
          data: {},
        });
      }

      const newNotif = await Notification.create({
        user_id: null,
        repair_shop_id: shopID,
        title: 'You Got a New Rating',
        message: `${user.firstname} ${user.lastname} gave your shop a ${score}-star rating.`,
        is_read: false,
        created_at: dayjs().format(),
      });

      req.io.emit(`newNotif-RS-${shopID}`, { newNotif });
      const unreadNotifs = await Notification.count({ where: { repair_shop_id: shopID, is_read: false } });
      req.io.emit(`newUnreadNotif-RS-${shopID}`, { unreadNotifs });

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

// UPDATE APPROVAL STATUS (ADMIN)
export const updateApprovalStatus = async (req, res) => {
  const user_id = req.user.user_id;
  const { shopID, decision } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id, role: 'Admin' } });

    if (user) {
      const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: shopID } });

      await shop.update({
        creation_date: dayjs().format(),
        approval_status: decision,
      });

      if (decision === 'Approved') {
        await axios.post('https://api.semaphore.co/api/v4/messages', {
          apikey: process.env.SEMAPHORE_API_KEY,
          number: shop.mobile_num,
          message: `Congratulations, ${shop.owner_firstname}! Your shop account has been approved. You can now log in to the app.`,
          sendername: 'AutoAIDER'
        });
      } else {
        await axios.post('https://api.semaphore.co/api/v4/messages', {
          apikey: process.env.SEMAPHORE_API_KEY,
          number: shop.mobile_num,
          message: `Hello ${shop.owner_firstname}, We regret to inform you that your shop account request was not approved.`,
          sendername: 'AutoAIDER'
        });
      }

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

// UPDATE SETTINGS MAP TYPE FOR SHOP
export const updateMapTypeRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { mapType } = req.body;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      await shop.update({
        settings_map_type: mapType,
      });

      req.io.emit(`updatedMapType-RS-${repair_shop_id}`, { mapType });
      res.sendStatus(201);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// UPDATE SETTINGS PUSH NOTIF FOR SHOP
export const updatePushNotifRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { pushNotif } = req.body;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      await shop.update({
        settings_push_notif: pushNotif ? false : true,
      });

      const updatedPushNotif = !pushNotif;
      req.io.emit(`updatedPushNotif-RS-${repair_shop_id}`, { updatedPushNotif });
      res.sendStatus(201);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE SHOP ACCOUNT
export const deleteAccountRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      await shop.update({
        mobile_num: 'Unknown Number',
        is_deleted: true,
      });

      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

//COUNT ALL REGISTERED REPAIR SHOPS (ADMIN)
export const countAllRS = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const allShops = await AutoRepairShop.count({ where: { approval_status: 'Approved',is_deleted: false } });
      res.status(200).json(allShops);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL NEWLY REGISTERED REPAIR SHOPS IN THE PAST 12 MONTHS (ADMIN)
export const newlyRegisteredRS = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const allShops = await AutoRepairShop.findAll({ where: { approval_status: 'Approved' } });
      const newShopsThisYear = allShops.filter((item) => dayjs(item.creation_date).utc(true).format('YYYY') === dayjs().utc(true).format('YYYY'));
      const jan = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Jan');
      const feb = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Feb');
      const mar = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Mar');
      const apr = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Apr');
      const may = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'May');
      const jun = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Jun');
      const jul = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Jul');
      const aug = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Aug');
      const sep = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Sep');
      const oct = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Oct');
      const nov = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Nov');
      const dec = newShopsThisYear.filter((item) => dayjs(item.creation_date).utc(true).format('MMM') === 'Dec');

      const newShopsPerMonth = {
        jan: [...jan].length,
        feb: [...feb].length,
        mar: [...mar].length,
        apr: [...apr].length,
        may: [...may].length,
        jun: [...jun].length,
        jul: [...jul].length,
        aug: [...aug].length,
        sep: [...sep].length,
        oct: [...oct].length,
        nov: [...nov].length,
        dec: [...dec].length,
      }

      res.status(200).json(newShopsPerMonth);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};