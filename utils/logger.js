import pino from 'pino';

import { env } from '../config/env.js';

const isDevelopment = env.NODE_ENV !== 'production';

const loggerOptions = {
  level: env.LOG_LEVEL,
};

if (isDevelopment) {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  };
}

export const logger = pino(loggerOptions);
