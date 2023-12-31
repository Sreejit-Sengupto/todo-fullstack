import { DATABASE_NAME } from '../constants.js';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DATABASE_NAME}`
        );
        console.log(`Connected to MongoDB Successfully🎉\nDB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection failed: ', error);
        process.exit(1);
    }
};

export default connectDB;
