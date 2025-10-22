
// File: server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return res.status(409).json({ error: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, password: hash });
  await user.save();

  res.set('Cache-Control', 'no-store');
  return res.json({ message: 'Signup successful' });
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body || {};
  console.info('[auth] POST /login for', emailOrPhone || 'unknown');

  const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

  res.set('Cache-Control', 'no-store');
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    console.info('[auth] issued token for user id:', decoded.id);
  } catch (e) {
    console.warn('[auth] local verify failed:', e?.message);
  }

  return res.json({ token });
});

// ✅ Me
router.get('/me', requireAuth, async (req, res) => {
  try {
    if (env.NODE_ENV !== 'production') {
      // WHY: field debugging when client claims “could not verify session”
      console.info('[auth] /me Authorization header:', req.headers.authorization || '(none)');
    }

    const user = await User.findById(req.user.id).select('email role');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.set('Cache-Control', 'no-store');
    return res.json({ id: user._id, email: user.email, role: user.role || 'user' });
  } catch (err) {
    console.error('Error in /api/auth/me', err);
    return res.status(500).json({ error: 'Could not verify session' });
  }
});

// Dev-only debug route (do NOT enable in prod)
if (env.NODE_ENV !== 'production') {
  router.post('/_debug/decode', (req, res) => {
    const bearer = (req.headers.authorization || '').split(' ')[1];
    const token = req.body?.token || bearer;
    if (!token) return res.status(400).json({ error: 'token is required in body or Authorization header' });
    try {
      const decoded = jwt.decode(token, { complete: false });
      console.info('[auth][debug] decoded keys:', Object.keys(decoded || {}));
      return res.json({ decoded });
    } catch (err) {
      console.error('[auth][debug] decode error', err?.message);
      return res.status(400).json({ error: 'Failed to decode token' });
    }
  });
}

export default router;