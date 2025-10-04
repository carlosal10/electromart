import mongoose from 'mongoose';

import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

export const startServer = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB Atlas');

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'Server running');
    });
  } catch (error) {
    logger.error({ error }, 'MongoDB connection error');
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

if (env.NODE_ENV !== 'test') {
  startServer();
}
