import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('MongoDB connected.')
    } catch (e) {
        console.error('MongoDB connection failed: ', e);
        process.exit(1);
    }
};

export default connectMongo;