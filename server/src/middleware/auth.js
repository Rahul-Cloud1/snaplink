import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function optionalAuth(req, _res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub).select('_id name email');
  } catch {
    req.user = null;
  }

  next();
}

export async function requireAuth(req, res, next) {
  await optionalAuth(req, res, () => {});
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}
