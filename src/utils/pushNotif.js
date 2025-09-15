import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushToTokens = async (tokens = [], { title, body, data = {} }) => {
  const messages = [];
  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Invalid Expo push token: ${token}`);
      continue;
    }
    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      channelId: 'default',
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (e) {
      console.error('Push send error', error);
    }
  }

  const receiptIDs = [];
  for (const ticket of tickets) {
    if (ticket.status === 'ok') {
      receiptIDs.push(ticket.id);
    }
  }

  const receiptIDChunks = expo.chunkPushNotificationReceiptIds(receiptIDs);
  for (const chunk of receiptIDChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      for (const receiptID in receipts) {
        const { status, message, details } = receipts[receiptID];
        if (status === 'ok') {
          continue;
        } else if (status === 'error') {
          console.error(`There was an error sending a notification: ${message}`);
          if (details && details.error) {
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (e) {
      console.error(error);
    }
  }
}