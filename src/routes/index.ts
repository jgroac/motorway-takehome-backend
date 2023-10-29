import express from 'express';
import { getVehicleState } from '../controllers/vehicleController';

const router = express.Router();

router.get('/health', (_, res) => {
  return res.status(200).send({
    status: 'OK',
  });
});

router.get('/vehicles/:id', getVehicleState);

export default router;
