import database from '../database/db';
import { Vehicle } from '../database/models';
import VehicleNotFoundException from '../exceptions/VehicleNotFoundException';

export async function getVehicleById(id: string) {
  const vehicle = (await database
    .select('*')
    .from('vehicles')
    .where('id', id)
    .first()) as Vehicle | null;

  if (!vehicle) {
    throw new VehicleNotFoundException('id', id);
  }

  return vehicle;
}
