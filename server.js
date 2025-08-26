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
import axios from 'axios';

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
  console.log('A user connected: ', socket.id);

  socket.on('sendMessage', async ({ senderID, receiverID, role, message, sentAt }) => {
    try {
      await axios.post('http://192.168.0.111:3000/api/messages/send-message',
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
  })
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
app.use('/api/cloudinary', cloudinaryRoutes);

// START SERVER
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server is running on http://192.168.0.111:${port}`);
});