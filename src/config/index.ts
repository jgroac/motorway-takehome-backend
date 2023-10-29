import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'dev'}.local` });

export const isDev = () => NODE_ENV !== 'production' && NODE_ENV !== 'test';

export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } =
  process.env;
