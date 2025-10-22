import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: num({ default: 5000 }),
  MONGO_URI: str(),
  CLIENT_BUILD_PATH: str({ default: 'client/build' }),
  CORS_ORIGINS: str({ 
    default: JSON.stringify([
      'https://electromart-server-4b6n.onrender.com',
      'https://ecommerce-2sgt.onrender.com',
      'https://electromart-2vwj.onrender.com'
    ])
  }),
  LOG_LEVEL: str({ default: 'info' }),
  JWT_SECRET: str({ default: '23f4g5h6j7k8l9m0n' }),
});
  