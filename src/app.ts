import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import expressPino from 'express-pino-logger';
import { NODE_ENV, PORT, isDev } from './config';
import routes from './routes';
import ExceptionHandler from './exceptions/handler';
import logger from './utils/logger';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeExceptionHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      if (isDev()) {
        logger.info(`http://localhost:${this.port}`);
      }

      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(
      expressPino({
        level: 'info',
        enabled: true,
      }),
    );
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use(routes);
  }

  private initializeExceptionHandling() {
    this.app.use(ExceptionHandler);
  }
}
