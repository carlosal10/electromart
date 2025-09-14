// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only.' });
  }
  next();
};
