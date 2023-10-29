import database from '../database/db';
import { Vehicle } from '../database/models';
import redis from '../database/redis';
import VehicleNotFoundException from '../exceptions/VehicleNotFoundException';
import logger from '../utils/logger';

export async function getVehicleById(id: string) {
  const cacheKey = `vehicle:${id}`;
  const cachedResource = await redis.get(cacheKey);

  if (cachedResource) {
    try {
      const vehicle: Vehicle = JSON.parse(cachedResource);
      return vehicle;
    } catch (err) {
      logger.error(`Error parsing cached resource: ${cacheKey}`);
    }
  }

  logger.info(`Cache miss ${cacheKey}`);
  const vehicle = (await database
    .select('*')
    .from('vehicles')
    .where('id', id)
    .first()) as Vehicle | null;

  if (!vehicle) {
    throw new VehicleNotFoundException('id', id);
  }

  await redis.set(cacheKey, JSON.stringify(vehicle));
  return vehicle;
}
