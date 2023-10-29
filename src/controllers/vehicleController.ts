import { NextFunction, Request, Response } from 'express';
import { getVehicleStateLog } from '../repository/stateLogRepository';
import { getVehicleById } from '../repository/vehicleRepository';

export async function getVehicleState(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  const timestamp = req.query.timestamp as string;

  try {
    const vehicle = await getVehicleById(id);
    const stateLog = await getVehicleStateLog(id, timestamp);

    res.json({
      id: vehicle.id.toString(),
      make: vehicle.make,
      model: vehicle.model,
      state: stateLog.state,
    });
  } catch (err) {
    next(err);
  }
}
