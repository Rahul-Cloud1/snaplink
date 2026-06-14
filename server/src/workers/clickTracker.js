import 'dotenv/config';
import { Worker } from 'bullmq';
import geoip from 'geoip-lite';
import mongoose from 'mongoose';
import { UAParser } from 'ua-parser-js';
import Click from '../models/Click.js';
import Link from '../models/Link.js';
import { redis } from '../lib/redis.js';

function parseReferrer(referrer) {
  if (!referrer) return 'direct';

  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return referrer || 'direct';
  }
}

function normalizeDevice(deviceType) {
  if (deviceType === 'mobile' || deviceType === 'tablet') return deviceType;
  return 'desktop';
}

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener');

const worker = new Worker(
  'clicks',
  async (job) => {
    const { slug, ip, userAgent, referrer } = job.data;
    const geo = geoip.lookup(ip);
    const ua = new UAParser(userAgent);
    const uaResult = ua.getResult();

    await Click.create({
      slug,
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown',
      device: normalizeDevice(uaResult?.device?.type),
      browser: uaResult?.browser?.name || 'Unknown',
      referrer: parseReferrer(referrer),
      ip,
      timestamp: new Date()
    });

    await Link.updateOne({ slug }, { $inc: { totalClicks: 1 } });
  },
  { connection: redis }
);

worker.on('completed', (job) => {
  console.log(`Tracked click job ${job.id}`);
});

worker.on('failed', (job, error) => {
  console.error(`Click job ${job?.id} failed:`, error.message);
});

console.log('Click tracker worker is running');
