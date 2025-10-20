import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * expects: { emailOrPhone, password }
 * responds: { token, user: { id, email, role } }
 */
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body || {};
    if (!emailOrPhone || !password)
      return res.status(400).json({ error: 'Missing credentials' });

    // Find by email OR phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Assuming you stored a hashed password; adjust if using plain
    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Include id/email/role in JWT payload
    const payload = { id: user._id, email: user.email, role: user.role || 'user' };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Protected route — verifies JWT and returns user identity.
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    // Look up latest user in DB in case role/email changed
    const user = await User.findById(req.user.id).select('email role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, email: user.email, role: user.role });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
