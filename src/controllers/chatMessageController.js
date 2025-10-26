import { AutoRepairShop, ChatMessage, SavePushToken, User } from "../models/index.js";
import { Op } from "sequelize";
import { sendPushToTokens } from "../utils/pushNotif.js";
import { onlineUsers, onlineShops } from "../utils/onlineUsers.js";

// GET CONVERSATION FOR CAR OWNER
export const getConversationForCarOwner = async (req, res) => {
  const user_id = req.user.user_id;
  const { repair_shop_id } = req.params

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const conversation = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_user_id: user_id, receiver_repair_shop_id: repair_shop_id },
            { sender_repair_shop_id: repair_shop_id, receiver_user_id: user_id },
          ]
        },
        order: [['sent_at', 'ASC']],
      });
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
      const conversation = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_repair_shop_id: repair_shop_id, receiver_user_id: user_id },
            { sender_user_id: user_id, receiver_repair_shop_id: repair_shop_id },
          ]
        },
        order: [['sent_at', 'ASC']],
      });
      res.status(200).json(conversation);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL CONVERSATIONS FOR CAR OWNER
export const getAllConversationsCO = async (req, res) => {
  const user_id = req.user.user_id;
  
  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const allChats = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_user_id: user_id },
            { receiver_user_id: user_id },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoData = await Promise.all(
        allChats.map(async (item) => {
          const shop = await AutoRepairShop.findOne({
            where: {
              repair_shop_id: item.sender_repair_shop_id ?? item.receiver_repair_shop_id,
            },
          });

          return {
            chatID: item.chat_id,
            shopID: shop?.repair_shop_id,
            senderID: item.sender_user_id,
            shopName: shop?.shop_name,
            profilePic: shop?.profile_pic,
            profileBG: shop?.profile_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: shop?.repair_shop_id,
          };
        })
      );

      const grouped = Object.values(
        chatInfoData.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              senderID: [item.senderID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].senderID.push(item.senderID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoData = grouped.map((item) => ({
        userID: user_id,
        chatID: item.chatID[item.chatID.length - 1],
        shopID: item.shopID,
        shopName: item.shopName,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: Number(item.senderID[item.senderID.length - 1]) === Number(user_id),
      }));

      res.status(200).json(groupedChatInfoData);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL CONVERSATIONS FOR REPAIR SHOP
export const getAllConversationsRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  
  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const allChats = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_repair_shop_id: repair_shop_id },
            { receiver_repair_shop_id: repair_shop_id },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoData = await Promise.all(
        allChats.map(async (item) => {
          const customer = await User.findOne({
            where: {
              user_id: Number(item.sender_user_id || item.receiver_user_id),
            },
          });

          return {
            chatID: item.chat_id,
            customerID: customer?.user_id,
            senderID: item.sender_repair_shop_id,
            customerFirstname: customer?.firstname,
            customerLastname: customer?.lastname,
            profilePic: customer?.profile_pic,
            profileBG: customer?.user_initials_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: customer?.user_id,
          };
        })
      );

      const grouped = Object.values(
        chatInfoData.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              senderID: [item.senderID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].senderID.push(item.senderID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoData = grouped.map((item) => ({
        shopID: repair_shop_id,
        chatID: item.chatID[item.chatID.length - 1],
        customerID: item.customerID,
        customerFirstname: item.customerFirstname,
        customerLastname: item.customerLastname,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: Number(item.senderID[item.senderID.length - 1]) === Number(repair_shop_id),
      }));

      res.status(200).json(groupedChatInfoData);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL UNREAD CHAT FROM CAR OWNER
export const countUnreadChatCO = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const unreadChats = await ChatMessage.count({ receiver_user_id: user_id, status: 'unread' });
      res.status(200).json(unreadChats);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL UNREAD CHAT FROM REPAIR SHOP
export const countUnreadChatRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const unreadChats = await ChatMessage.count({ receiver_repair_shop_id: repair_shop_id, status: 'unread' });
      res.status(200).json(unreadChats);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// SEND AND RECEIVE MESSAGE
export const sendMessage = async (req, res) => {
  const { senderID, receiverID, role, message, sentAt } = req.body;

  try {
    if (role === 'car-owner') {
      const conversation = await ChatMessage.create({
        sender_user_id: senderID,
        sender_repair_shop_id: null,
        receiver_user_id: null,
        receiver_repair_shop_id: receiverID,
        message: message,
        sent_at: sentAt,
        status: 'unread',
      });

      const newChatCO = {
        chatID: conversation.chat_id,
        senderUserID: conversation.sender_user_id,
        senderShopID: conversation.sender_repair_shop_id,
        receiverUserID: conversation.receiver_user_id,
        receiverShopID: conversation.receiver_repair_shop_id,
        message: conversation.message,
        sentAt: conversation.sent_at,
        status: conversation.status,
        fromYou: Number(conversation.sender_user_id) === senderID,
      };

      const newChatRS = {
        chatID: conversation.chat_id,
        senderUserID: conversation.sender_user_id,
        senderShopID: conversation.sender_repair_shop_id,
        receiverUserID: conversation.receiver_user_id,
        receiverShopID: conversation.receiver_repair_shop_id,
        message: conversation.message,
        sentAt: conversation.sent_at,
        status: conversation.status,
        fromYou: Number(conversation.sender_user_id) === receiverID,
      };

      req.io.emit('receiveMessageCO', { newChatCO });
      req.io.emit('receiveMessageRS', { newChatRS });

      const allChatsCO = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_user_id: senderID },
            { receiver_user_id: senderID },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoDataCO = await Promise.all(
        allChatsCO.map(async (item) => {
          const shop = await AutoRepairShop.findOne({
            where: {
              repair_shop_id: Number(item.sender_repair_shop_id || item.receiver_repair_shop_id),
            },
          });

          return {
            chatID: item.chat_id,
            shopID: shop?.repair_shop_id,
            shopName: shop?.shop_name,
            profilePic: shop?.profile_pic,
            profileBG: shop?.profile_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: shop?.repair_shop_id,
          };
        })
      );

      const groupedCO = Object.values(
        chatInfoDataCO.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoDataCO = groupedCO.map((item) => ({
        userID: senderID,
        chatID: item.chatID[item.chatID.length - 1],
        shopID: item.shopID,
        shopName: item.shopName,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: true,
      }));

      req.io.emit(`updateInbox-CO-${senderID}`, { groupedChatInfoDataCO });

      const allChatsRS = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_repair_shop_id: receiverID },
            { receiver_repair_shop_id: receiverID },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoDataRS = await Promise.all(
        allChatsRS.map(async (item) => {
          const customer = await User.findOne({
            where: {
              user_id: Number(item.sender_user_id || item.receiver_user_id),
            },
          });

          return {
            chatID: item.chat_id,
            customerID: customer?.user_id,
            customerFirstname: customer?.firstname,
            customerLastname: customer?.lastname,
            profilePic: customer?.profile_pic,
            profileBG: customer?.user_initials_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: customer?.user_id,
          };
        })
      );

      const groupedRS = Object.values(
        chatInfoDataRS.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoDataRS = groupedRS.map((item) => ({
        shopID: receiverID,
        chatID: item.chatID[item.chatID.length - 1],
        customerID: item.customerID,
        customerFirstname: item.customerFirstname,
        customerLastname: item.customerLastname,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: false,
      }));

      req.io.emit(`updateInbox-RS-${receiverID}`, { groupedChatInfoDataRS });

      const isOnline = onlineShops.some(s => s.shopID === receiverID);

      if (!isOnline) {
        const tokens = await SavePushToken.findAll({ where: { repair_shop_id: receiverID } });
        const tokenValues = tokens.map(t => t.token);

        await sendPushToTokens(tokenValues, {
          title: 'New Message',
          body: message,
          data: {},
        });
      }

      res.sendStatus(201);
    } else {
      const conversation = await ChatMessage.create({
        sender_user_id: null,
        sender_repair_shop_id: senderID,
        receiver_user_id: receiverID,
        receiver_repair_shop_id: null,
        message: message,
        sent_at: sentAt,
        status: 'unread',
      });

      const newChatRS = {
        chatID: conversation.chat_id,
        senderUserID: conversation.sender_user_id,
        senderShopID: conversation.sender_repair_shop_id,
        receiverUserID: conversation.receiver_user_id,
        receiverShopID: conversation.receiver_repair_shop_id,
        message: conversation.message,
        sentAt: conversation.sent_at,
        status: conversation.status,
        fromYou: Number(conversation.sender_repair_shop_id) === senderID,
      };

      const newChatCO = {
        chatID: conversation.chat_id,
        senderUserID: conversation.sender_user_id,
        senderShopID: conversation.sender_repair_shop_id,
        receiverUserID: conversation.receiver_user_id,
        receiverShopID: conversation.receiver_repair_shop_id,
        message: conversation.message,
        sentAt: conversation.sent_at,
        status: conversation.status,
        fromYou: Number(conversation.sender_repair_shop_id) === receiverID,
      };

      req.io.emit('receiveMessageRS', { newChatRS });
      req.io.emit('receiveMessageCO', { newChatCO });

      const allChatsRS = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_repair_shop_id: senderID },
            { receiver_repair_shop_id: senderID },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoDataRS = await Promise.all(
        allChatsRS.map(async (item) => {
          const customer = await User.findOne({
            where: {
              user_id: Number(item.sender_user_id || item.receiver_user_id),
            },
          });

          return {
            chatID: item.chat_id,
            customerID: customer?.user_id,
            customerFirstname: customer?.firstname,
            customerLastname: customer?.lastname,
            profilePic: customer?.profile_pic,
            profileBG: customer?.user_initials_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: customer?.user_id,
          };
        })
      );

      const groupedRS = Object.values(
        chatInfoDataRS.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoDataRS = groupedRS.map((item) => ({
        shopID: senderID,
        chatID: item.chatID[item.chatID.length - 1],
        customerID: item.customerID,
        customerFirstname: item.customerFirstname,
        customerLastname: item.customerLastname,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: true,
      }));

      req.io.emit(`updateInbox-RS-${senderID}`, { groupedChatInfoDataRS });

      const allChatsCO = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { sender_user_id: receiverID },
            { receiver_user_id: receiverID },
          ]
        },
        order: [['sent_at', 'ASC']],
      });

      const chatInfoDataCO = await Promise.all(
        allChatsCO.map(async (item) => {
          const shop = await AutoRepairShop.findOne({
            where: {
              repair_shop_id: Number(item.sender_repair_shop_id || item.receiver_repair_shop_id),
            },
          });

          return {
            chatID: item.chat_id,
            shopID: shop?.repair_shop_id,
            shopName: shop?.shop_name,
            profilePic: shop?.profile_pic,
            profileBG: shop?.profile_bg,
            message: item.message,
            messageDate: item.sent_at,
            status: item.status,
            group: shop?.repair_shop_id,
          };
        })
      );

      const groupedCO = Object.values(
        chatInfoDataCO.reduce((acc, item) => {
          const id = item.group;
          if (!acc[id]) {
            acc[id] = {
              ...item,
              chatID: [item.chatID],
              message: [item.message],
              messageDate: [item.messageDate],
              status: [item.status],
              group: item.group,
            };
          } else {
            acc[id].chatID.push(item.chatID);
            acc[id].message.push(item.message);
            acc[id].messageDate.push(item.messageDate);
            acc[id].status.push(item.status);
          }
          return acc;
        }, {})
      );

      const groupedChatInfoDataCO = groupedCO.map((item) => ({
        userID: receiverID,
        chatID: item.chatID[item.chatID.length - 1],
        shopID: item.shopID,
        shopName: item.shopName,
        profilePic: item.profilePic,
        profileBG: item.profileBG,
        message: item.message[item.message.length - 1],
        messageDate: item.messageDate[item.messageDate.length - 1],
        status: item.status[item.status.length - 1],
        fromYou: false,
      }));

      req.io.emit(`updateInbox-CO-${receiverID}`, { groupedChatInfoDataCO });

      const isOnline = onlineUsers.some(u => u.userID === receiverID);

      if (!isOnline) {
        const tokens = await SavePushToken.findAll({ where: { user_id: receiverID } });
        const tokenValues = tokens.map(t => t.token);

        await sendPushToTokens(tokenValues, {
          title: 'New Message',
          body: message,
          data: {},
        });
      }

      res.sendStatus(201);
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// UPDATE MESSAGE STATUS
export const updateMessageStatus = async (req, res) => {
  const { chatIDs, status } = req.body;

  try {
    const updatedChat = [];

    for (const id of chatIDs) {
      const chat = await ChatMessage.findOne({ where: { chat_id: id } })
      await chat.update({
        status: status,
      });
      updatedChat.push({
        chatID: id,
        status: status,
      });
    }

    req.io.emit('updatedMessage', { updatedChat });
    res.sendStatus(201);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}