import { SavePushToken } from "../models/index";

// SAVE TOKEN
export const saveToken = async (req, res) => {
  let userID;
  const { token, platform, role, updatedAt } = req.body;
  if (role === 'car-owner') {
    userID = req.user.user_id;
  } else {
    userID = req.user.repair_shop_id;
  }

  try {
    if (!userID || !token) return res.status(400).json({ error: 'userID and token are required' });

    await SavePushToken.upsert({
      user_id: role === 'car-owner' ? userID : null,
      repair_shop_id: role === 'repair-shop' ? userID : null,
      platform: platform,
      updated_at: updatedAt,
      token: token,
    });

    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}