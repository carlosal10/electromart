import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile - get current user profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - update current user profile
router.put('/', requireAuth, async (req, res) => {
  try {
    const { name, phone, address } = req.body || {};
    const updates = {};
    if (name) updates.name = String(name).trim();
    if (phone) updates.phone = String(phone).trim();
    if (address) updates.address = String(address).trim();

    const user = await User
      .findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
      .select('-password');

    return res.json({ message: 'Profile updated', user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

