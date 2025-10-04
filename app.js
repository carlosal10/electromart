import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import mpesaRoutes from './routes/mpesa.js';
import categoryRoutes from './routes/Category.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import heroRoutes from './routes/hero.js';
import showcaseRoutes from './routes/showcase.js';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'https://ecommerce-electronics-0j4e.onrender.com',
  'https://ecommerce-2sgt.onrender.com',
  'https://electromart-2vwj.onrender.com',
];

export const createApp = () => {
  const app = express();

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
  app.use('/uploads', express.static('uploads'));
  app.use('/api/orders', ordersRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/payments', mpesaRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/showcase', showcaseRoutes);

  const clientBuildPath = path.join(__dirname, env.CLIENT_BUILD_PATH);
  app.use(express.static(clientBuildPath));

  app.get('/test', (_req, res) => { res.send('Server is working'); });

  app.get(/^\\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });

  return app;
};

export const app = createApp();
