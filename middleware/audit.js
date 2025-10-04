import AuditLog from '../models/AuditLog.js';

export const auditLog = () => async (req, res, next) => {
  const start = Date.now();
  const end = res.end;
  res.end = async function (...args) {
    try {
      const duration = Date.now() - start;
      const entry = new AuditLog({
        userId: req.auth?.id || null,
        role: req.auth?.role || null,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        payload: req.method !== 'GET' ? req.body : undefined,
      });
      await entry.save().catch(() => {});
    } catch {}
    return end.apply(this, args);
  };
  next();
};
