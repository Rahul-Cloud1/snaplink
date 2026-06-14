import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import shortenRoutes from './routes/shorten.js';

const app = express();
const port = process.env.PORT || 5000;

// Trust Railway proxy
app.set('trust proxy', 1);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Snaplink API is running 🚀',
  });
});

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'url-shortener-api',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/shorten', shortenRoutes);
app.use('/api/analytics', analyticsRoutes);

// Short URL redirect routes
app.use('/', shortenRoutes);

// Global error handler
app.use((error, _req, res, _next) => {
  console.error('Server Error:', error);

  res.status(error.status || 500).json({
    ok: false,
    error: error.message || 'Internal Server Error',
  });
});

// Database connection + server start
const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener'
    );

    console.log('MongoDB connected successfully');

    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();