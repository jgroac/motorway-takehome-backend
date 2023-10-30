import { App } from './app';
import database from './database/db';
import redis from './database/redis';

const app = new App();

const server = app.listen();

const handleShutdown = () => {
  server.close(() => {
    database.destroy();
    redis.disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
