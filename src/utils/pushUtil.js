import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushToTokens = async (tokens = [], { title, body, data = {} }) => {
  const messages = [];
  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.warn(`Invalid Expo push token: ${token}`);
      continue;
    }
    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      channelID: 'default',
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

  return tickets;
}