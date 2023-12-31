import dotenv from 'dotenv';
import connectDB from './database/index.js';
import { app } from './app.js';
dotenv.config({
    path: './.env',
});

connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.log('Could not connect to MongoDB');
            throw error;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection failed');
    });
