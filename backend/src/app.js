import express from 'express';
import cors from 'cors';
import cookierParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(cookierParser());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

import userRouter from './routes/user.routes.js';
app.use('/api/v1/users', userRouter);

// http://localhost:8000/api/v1/users

export { app };
