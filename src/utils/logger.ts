import pino from 'pino';
import { isDev } from '../config';

const logger = pino({
  level: 'info',
  enabled: isDev(),
});

export default logger;
