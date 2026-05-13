import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: num({ default: 5000 }),
  MONGO_URI: str({ devDefault: 'mongodb://127.0.0.1:27017/electromart_dev' }),
  CLIENT_BUILD_PATH: str({ default: 'client/build' }),
  CORS_ORIGINS: str({ 
    devDefault: JSON.stringify([
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
    ])
  }),
  LOG_LEVEL: str({ default: 'info' }),
  JWT_SECRET: str({ devDefault: 'dev-only-change-me-before-production' }),
});
  
