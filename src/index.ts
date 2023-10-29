import { App } from './app';
import database from './database/db';

const app = new App();

const server = app.listen();

const handleShutdown = () => {
  server.close(() => {
    database.destroy();
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
