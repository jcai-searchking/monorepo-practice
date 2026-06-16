import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './auth/auth.routes';
import userRoutes from './users/users.routes';
import healthRoutes from './health/health.routes';
import { errorHandler } from './middleware/errorHandler';


export const app = express();

// Global Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/health', healthRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes)

// Error handler should be the last middleware
app.use(errorHandler)