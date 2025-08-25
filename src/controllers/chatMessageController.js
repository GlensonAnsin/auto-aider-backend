import { AutoRepairShop, ChatMessage, User } from "../models/index.js";

// GET CONVERSATION FOR CAR OWNER
export const getConversationForCarOwner = async (req, res) => {
  const user_id = req.user.user_id;
  const { repair_shop_id } = req.params

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const conversation = await ChatMessage.findAll({ where: { sender_user_id: user_id, receiver_repair_shop_id: repair_shop_id } });
      res.status(200).json(conversation);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET CONVERSATION FOR REPAIR SHOP
export const getConversationForShop = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { user_id } = req.params;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const conversation = await ChatMessage.findAll({ where: { sender_repair_shop_id: repair_shop_id, receiver_user_id: user_id } });
      res.status(200).json(conversation);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};