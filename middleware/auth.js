import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token || !env.JWT_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
};
