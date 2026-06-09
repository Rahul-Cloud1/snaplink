import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import shortenRoutes from './routes/shorten.js';

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'url-shortener-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shorten', shortenRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/', shortenRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener');

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
