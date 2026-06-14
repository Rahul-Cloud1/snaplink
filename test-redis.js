// test-redis.js (CommonJS)
const Redis = require('ioredis');

const url = 'rediss://default:gQAAAAAAAYYSAAIgcDFiMTVlZjA0ZTY3OGQ0YmQ5ODUyZmZiZGJlZmQ0MWZhNA@one-hedgehog-99858.upstash.io:6379';

const redis = new Redis(url, { tls: { rejectUnauthorized: false } });

redis.on('error', (err) => {
  console.error('Redis error:', err);
  process.exit(1);
});

redis.ping().then((v) => {
  console.log('PING =>', v);
  return redis.quit();
}).catch((err) => {
  console.error('Ping failed:', err);
  process.exit(1);
});