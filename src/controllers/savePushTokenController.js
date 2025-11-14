import { SavePushToken } from "../models/index.js";

// SAVE TOKEN
export const saveToken = async (req, res) => {
  const { userID, token, platform, role, updatedAt } = req.body;
  try {
    await SavePushToken.upsert({
      user_id: role === 'car-owner' ? userID : null,
      repair_shop_id: role === 'repair-shop' ? userID : null,
      platform: platform,
      updated_at: updatedAt,
      token: token,
    });

    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}