import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../lib/redis.js';

function createStore(prefix) {
  return new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix
  });
}

export const anonymousCreateLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => Boolean(req.user),
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  store: createStore('rl:anon:'),
  message: {
    error: 'Too many links created. Try again in an hour.',
    retryAfter: '1 hour'
  }
});

export const authenticatedCreateLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.user,
  keyGenerator: (req) => req.user.id,
  store: createStore('rl:user:'),
  message: {
    error: 'Too many links created. Try again in an hour.',
    retryAfter: '1 hour'
  }
});
