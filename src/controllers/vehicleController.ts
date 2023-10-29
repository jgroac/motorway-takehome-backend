import { NextFunction, Request, Response } from 'express';
import { getVehicleStateLog } from '../repository/stateLogRepository';
import { getVehicleById } from '../repository/vehicleRepository';

type VehicleResponse = {
  id: string;
  make: string;
  model: string;
  state: string;
};

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

    const response = {
      id: vehicle.id.toString(),
      make: vehicle.make,
      model: vehicle.model,
      state: stateLog.state,
    } as VehicleResponse;

    res.json(response);
  } catch (err) {
    next(err);
  }
}
