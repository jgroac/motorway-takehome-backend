import express from 'express';
import { getVehicleState } from '../controllers/vehicleController';
import validator from '../middleware/validator';

const router = express.Router();

router.get('/health', (_, res) => {
  return res.status(200).send({
    status: 'OK',
  });
});

router.get('/vehicles/:id', validator, getVehicleState);

export default router;
