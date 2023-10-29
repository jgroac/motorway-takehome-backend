import database from '../database/db';
import dayjs from 'dayjs';
import { StateLog } from '../database/models';
import StateLogNotFoundException from '../exceptions/StateLogNotFoundException';

export async function getVehicleStateLog(id: string, timestamp: string) {
  const parsedDate = dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss ZZ');
  const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss');

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

  return stateLog;
}
