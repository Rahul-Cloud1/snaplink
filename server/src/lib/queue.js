import { Queue } from 'bullmq';
import { redis } from './redis.js';

export const clickQueue = new Queue('clicks', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 5000
  }
});
