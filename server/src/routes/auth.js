import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

function authResponse(user) {
  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email }
  };
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Enter a valid email' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: 'Email is already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json(authResponse(user));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json(authResponse(user));
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
