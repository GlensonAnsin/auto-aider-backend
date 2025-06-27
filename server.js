import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectPostgres from './src/config/postgresDB.js';
import connectMongo from './src/config/mongoDB.js';
import userRoutes from './src/routes/userRoutes.js';
import autoRepairShopRoutes from './src/routes/autoRepairShopRoutes.js'
import vehicleRoutes from './src/routes/vehicleRoutes.js'

const app = express();
const port = process.env.PORT;

dotenv.config();

app.use(cors());
app.use(express.json());

await connectPostgres();

app.get('/', (req, res) => {
    res.send('Server is running.')
});

app.use('/api/user', userRoutes);
app.use('/api/auto_repair_shop', autoRepairShopRoutes);
app.use('/api/vehicle', vehicleRoutes);

app.listen(port, () => console.log(`Server is  running on http://192.168.0.111:${port}`));