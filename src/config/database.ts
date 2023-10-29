import { DB_CLIENT, DB_HOST, DB_PASS, DB_PORT, DB_USER } from './index';

type DatabaseConfigKey = 'sqlite' | 'pg';
type DatabaseConfig = {
  [key in DatabaseConfigKey]: {
    client: string;
    connection: {
      host?: string;
      user?: string;
      password?: string;
      database?: string;
      filename?: string;
      port?: number;
    };
    migrations?: {
      directory: string;
    };
    useNullAsDefault?: boolean;
  };
};

const databaseConfig: DatabaseConfig = {
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
    },
  },
  pg: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: 'motorway',
      port: Number(DB_PORT),
    },
    migrations: {
      directory: './src/database/migrations',
    },
  },
};

const dbConfig = databaseConfig[(DB_CLIENT || 'pg') as DatabaseConfigKey];

export default dbConfig;
