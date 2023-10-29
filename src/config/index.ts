import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export const isDev = () => NODE_ENV !== 'production' && NODE_ENV !== 'test';

export const { NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_CLIENT } =
  process.env;
