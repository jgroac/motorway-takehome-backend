import { App } from '../../app';
import request from 'supertest';
import database from '../../database/db';
interface Vehicle {
  id: number;
  make: string;
  state: string;
}

it('should return vehicle the correct vehicle state when vehicle exists and given a valid timestamp', async () => {
  const app = new App().getServer();
  const [vehicle] = (await database('vehicles')
    .insert({
      make: 'BMW',
      model: 'X1',
      state: 'sold',
    })
    .returning('*')) as Vehicle[];

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'quoted',
    timestamp: "2022-08-10 11:10:00+00'",
  });

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'selling',
    timestamp: "2022-08-20 09:23:00+00'",
  });

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'sold',
    timestamp: "2022-09-12 10:00:00+00'",
  });

  const targetDate = '2022-08-22 10:00:00+00';
  const response = await request(app)
    .get(`/vehicles/${vehicle.id}?timestamp=${encodeURIComponent(targetDate)}`)
    .expect('Content-Type', /json/);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual({
    id: '1',
    make: 'BMW',
    model: 'X1',
    state: 'selling',
  });
});
