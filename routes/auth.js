import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

// Lightweight auth guard used by /me so the client can verify a session
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // decoded should contain at least { id }
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('JWT verify error:', err && err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const router = express.Router();

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return res.status(409).json({ error: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, password: hash });
  await user.save();

  res.json({ message: 'Signup successful' });
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// GET /me - returns basic identity for the logged-in user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user._id, email: user.email, role: user.role || 'user' });
  } catch (err) {
    console.error('Error in /api/auth/me', err);
    return res.status(500).json({ error: 'Could not verify session' });
  }
});

export default router;

