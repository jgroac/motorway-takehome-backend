import { NextFunction, Request, Response } from 'express';
import dayjs from 'dayjs';
import database from '../database/db';

export async function getVehicleState(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  const timestamp = req.query.timestamp as string;

  try {
    const parsedDate = dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss ZZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss');

    const state = await database
      .select('*')
      .from('stateLogs')
      .where('vehicleId', id)
      .where('timestamp', '<=', formattedDate)
      .orderBy('timestamp', 'desc')
      .first();

    const vehicle = await database
      .select('*')
      .from('vehicles')
      .where('id', id)
      .first();

    res.json({
      id: vehicle.id.toString(),
      make: vehicle.make,
      model: vehicle.model,
      state: state?.state,
    });
  } catch (err) {
    next(err);
  }
}
