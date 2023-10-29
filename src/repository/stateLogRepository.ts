import database from '../database/db';
import dayjs from 'dayjs';
import { StateLog } from '../database/models';
import StateLogNotFoundException from '../exceptions/StateLogNotFoundException';
import redis from '../database/redis';
import logger from '../utils/logger';

export async function getVehicleStateLog(id: string, timestamp: string) {
  const parsedDate = dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss ZZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss');

  const cacheKey = `stateLog:${id}:${formattedDate}`;
  const cachedResource = await redis.get(cacheKey);

  if (cachedResource) {
    try {
      const stateLog: StateLog = JSON.parse(cachedResource);
      return stateLog;
    } catch (err) {
      logger.error(`Error parsing cached resource: ${cacheKey}`);
    }
  }

  logger.info(`Cache miss ${cacheKey}`);
  const stateLog = (await database
    .select('*')
    .from('stateLogs')
    .where('vehicleId', id)
    .where('timestamp', '<=', formattedDate)
    .orderBy('timestamp', 'desc')
    .first()) as StateLog | null;

  if (!stateLog) {
    throw new StateLogNotFoundException('id', id);
  }

  await redis.set(cacheKey, JSON.stringify(stateLog));
  return stateLog;
}
