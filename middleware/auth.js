import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Middleware that verifies a Bearer token in Authorization header
export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // payload (should include id, role, etc.)
    return next();
  } catch (err) {
    console.error('JWT verify error:', err && err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Role guard factory: requireRole('admin') etc.
export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if ((req.user.role || 'user') !== role) return res.status(403).json({ error: 'Forbidden' });
  return next();
};

// Export a convenience isAdmin (optional)
export const isAdmin = (req, res, next) => requireRole('admin')(req, res, next);
