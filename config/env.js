import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: num({ default: 5000 }),
  MONGO_URI: str(),
  CLIENT_BUILD_PATH: str({ default: 'client/build' }),
  CORS_ORIGINS: str({ default: '' }),
  LOG_LEVEL: str({ default: 'info' }),
  JWT_SECRET: str({ default: '' }),\n});
