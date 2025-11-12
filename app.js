import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import mpesaRoutes from './routes/mpesa.js';
import categoryRoutes from './routes/Category.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import heroRoutes from './routes/hero.js';
import showcaseRoutes from './routes/showcase.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/reviews.js';
import profileRoutes from './routes/profile.js';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const fallbackOrigins = [
  'https://electromart-server-4b6n.onrender.com',
  'https://ecommerce-2sgt.onrender.com',
  'https://electromart-2vwj.onrender.com',
];

const parseAllowedOrigins = () => {
  try {
    const parsed = JSON.parse(env.CORS_ORIGINS);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    logger.warn('CORS_ORIGINS env is not an array or is empty. Using fallback origins.');
    return fallbackOrigins;
  } catch (error) {
    logger.warn({ error }, 'Failed to parse CORS_ORIGINS env. Using fallback origins.');
    return fallbackOrigins;
  }
};

const allowedOrigins = parseAllowedOrigins();

export const createApp = () => {
  const app = express();

  // Apply common security headers (X-DNS-Prefetch-Control, Strict-Transport-Security, etc.)
  app.use(helmet());

  // Rate limit authentication endpoints to mitigate brute force attacks
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth', authLimiter);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin }, 'CORS blocked');
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true
  }));

  app.use(express.json());
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/payments', mpesaRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/showcase', showcaseRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/reviews', reviewRoutes);

  app.get('/test', (_req, res) => { res.send('Server is working'); });

  // Serve frontend static assets when a build is present.
  // This allows the same server to host the API and the built React app.
  // We prefer a top-level `build/` directory, fallback to `client/build/`.
  const possibleBuildDirs = [path.join(process.cwd(), 'build'), path.join(process.cwd(), 'client', 'build')];
  const staticDir = possibleBuildDirs.find(d => fs.existsSync(d));
  if (staticDir) {
    app.use(express.static(staticDir));

    // SPA fallback: serve index.html for non-API routes so client-side routing works
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  return app;
};

export const app = createApp();
