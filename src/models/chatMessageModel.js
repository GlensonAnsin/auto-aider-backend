import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresDB.js';

const ChatMessage = sequelize.define('chat_message', {
  chat_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  sender_user_id: { type: DataTypes.BIGINT },
  sender_repair_shop_id: { type: DataTypes.BIGINT },
  receiver_user_id: { type: DataTypes.BIGINT },
  receiver_repair_shop_id: { type: DataTypes.BIGINT },
  message: { type: DataTypes.STRING, allowNull: false },
  sent_at: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
}, {
  tableName: 'chat_message',
  timestamps: false,
});

export default ChatMessage;