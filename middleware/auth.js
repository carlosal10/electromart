// File: server/middleware/auth.js
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Accepts Authorization: Bearer <token> OR x-auth-token
export const requireAuth = (req, res, next) => {
  const h = req.headers || {};
  const auth = (h.authorization || '').trim();
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  const alt = (h['x-auth-token'] || '').trim();
  const token = bearer || alt;

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // must contain at least { id }
    return next();
  } catch (err) {
    console.error('JWT verify error:', err?.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if ((req.user.role || 'user') !== role) return res.status(403).json({ error: 'Forbidden' });
  return next();
};

export const isAdmin = (req, res, next) => requireRole('admin')(req, res, next);