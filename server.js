import express from 'express';
import dotenv from 'dotenv';
import connectPostgres from './src/config/postgresDB.js';
import connectMongo from './src/config/mongoDB.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

await connectPostgres();
await connectMongo();

app.get('/', (req, res) => {
    res.send('Server is running.')
});

app.listen(port, () => console.log(`Server is  running on http://localhost:${port}`));