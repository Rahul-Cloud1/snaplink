import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

export const URL_CACHE_TTL_SECONDS = 60 * 60 * 24;
