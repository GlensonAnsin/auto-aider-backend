import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectPostgres from './src/config/postgresDB.js';
import userRoutes from './src/routes/userRoutes.js';
import autoRepairShopRoutes from './src/routes/autoRepairShopRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import vehicleDiagnosticRoutes from './src/routes/vehicleDiagnosticRoutes.js'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cloudinaryRoutes from './src/routes/cloudinaryRoutes.js';
import mechanicRequestRoutes from './src/routes/mechanicRequestRoutes.js';
import chatMessageRoutes from './src/routes/chatMessageRoutes.js';
import savePushTokenRoutes from './src/routes/savePushTokenRoutes.js';
import axios from 'axios';
import { onlineUsers, onlineShops } from './src/utils/onlineUsers.js';

const app = express();
const httpServer = createServer(app);

// SOCKET
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerUser', ({ userID, role }) => {
    if (role === 'car-owner') {
      socket.data.userID = userID;

      let user = onlineUsers.find(u => u.userID === userID);
      if (!user) {
        user = { userID, sockets: [] };
        onlineUsers.push(user);
      }
      user.sockets.push(socket.id);
      io.emit('userOnline', { ID: socket.data.userID, isOnline: true });
    } else {
      socket.data.shopID = userID;

      let shop = onlineShops.find(s => s.shopID === userID);
      if (!shop) {
        shop = { shopID: userID, sockets: [] };
        onlineShops.push(shop);
      }
      shop.sockets.push(socket.id);
      io.emit('shopOnline', { ID: socket.data.shopID, isOnline: true });
    }

    return () => {
      socket.off('registerUser');
    }
  });

  socket.on('checkOnlineStatus', ({ ID, role }, callback) => {
    if (role === 'car-owner') {
      const isOnline = onlineShops.some(s => s.shopID === ID);
      callback({ online: isOnline });
    } else {
      const isOnline = onlineUsers.some(u => u.userID === ID);
      callback({ online: isOnline });
    }
    return () => {
      socket.off('checkOnlineStatus');
    }
  });

  socket.on('disconnect', () => {
    if (socket.data.userID) {
      const user = onlineUsers.find(u => u.userID === socket.data.userID);
      if (user) {
        user.sockets = user.sockets.filter(id => id !== socket.id);
        if (user.sockets.length === 0) {
          const idx = onlineUsers.findIndex(u => u.userID === socket.data.userID);
          onlineUsers.splice(idx, 1);
          io.emit('userOffline', { ID: socket.data.userID, isOnline: false });
        }
      }
    }

    if (socket.data.shopID) {
      const shop = onlineShops.find(s => s.shopID === socket.data.shopID);
      if (shop) {
        shop.sockets = shop.sockets.filter(id => id !== socket.id);
        if (shop.sockets.length === 0) {
          const idx = onlineShops.findIndex(s => s.shopID === socket.data.shopID);
          onlineShops.splice(idx, 1);
          io.emit('shopOffline', { ID: socket.data.shopID, isOnline: false });
        }
      }
    }
  });

  socket.on('sendMessage', async ({ senderID, receiverID, role, message, sentAt }) => {
    socket.data.onlineUsers = onlineUsers;
    socket.data.onlineShops = onlineShops;
    try {
      await axios.post('http://192.168.0.100:3000/api/messages/send-message',
        {
          senderID,
          receiverID,
          role,
          message,
          sentAt,
        },
      );

    } catch (e) {
      console.error('Send message error:', e);
    }

    return () => {
      socket.off('sendMessage');
    }
  });

  socket.on('updateStatus', async ({ chatIDs, status }) => {
    try {
      await axios.patch('http://192.168.0.100:3000/api/messages/update-message-status',
        {
          chatIDs,
          status,
        },
      );
      
    } catch (e) {
      console.error('Update message status error:', e);
    }

    return () => {
      socket.off('updateStatus');
    }
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ENV VAR
dotenv.config();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
await connectPostgres();

// ROUTES
app.get('/', (req, res) => {
  res.send('Server is running.')
});

app.use('/api/user', userRoutes);
app.use('/api/auto_repair_shop', autoRepairShopRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/vehicle_diagnostic', vehicleDiagnosticRoutes);
app.use('/api/mechanic_request', mechanicRequestRoutes);
app.use('/api/messages', chatMessageRoutes);
app.use('/api/notifications', savePushTokenRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// START SERVER
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server is running on http://192.168.0.100:${port}`);
});