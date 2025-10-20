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

  // Prevent caching for auth endpoints
  res.set('Cache-Control', 'no-store');
  res.json({ message: 'Signup successful' });
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  console.info('[auth] POST /login called for', emailOrPhone ? emailOrPhone : 'unknown user');
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
  // Prevent caching of token responses
  res.set('Cache-Control', 'no-store');
  // Log decoded payload info (id only) for debugging
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    console.info('[auth] issued token for user id:', decoded.id);
  } catch (e) {
    console.warn('[auth] token issued but failed local verify:', e && e.message);
  }

  res.json({ token });
});

// GET /me - returns basic identity for the logged-in user
router.get('/me', requireAuth, async (req, res) => {
  try {
    console.info('[auth] GET /me called; verified user id:', req.user?.id);
    const user = await User.findById(req.user.id).select('email role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Prevent caching of identity responses
    res.set('Cache-Control', 'no-store');
    return res.json({ id: user._id, email: user.email, role: user.role || 'user' });
  } catch (err) {
    console.error('Error in /api/auth/me', err);
    return res.status(500).json({ error: 'Could not verify session' });
  }
});

// Development-only debug route to decode a JWT payload (DO NOT ENABLE IN PRODUCTION)
if (env.NODE_ENV !== 'production') {
  router.post('/_debug/decode', (req, res) => {
    const token = req.body?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'token is required in body or Authorization header' });
    try {
      const decoded = jwt.decode(token, { complete: false });
      // Return decoded payload without verifying signature — helpful when secret mismatch suspected
      console.info('[auth][debug] decoded payload keys:', Object.keys(decoded || {}));
      return res.json({ decoded });
    } catch (err) {
      console.error('[auth][debug] decode error', err && err.message);
      return res.status(400).json({ error: 'Failed to decode token' });
    }
  });
}

export default router;

