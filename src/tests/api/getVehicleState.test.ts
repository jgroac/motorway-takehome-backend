import { App } from '../../app';
import request from 'supertest';
import database from '../../database/db';
import { StateLog, Vehicle } from '../../database/models';

it('should return vehicle the correct vehicle state when vehicle exists and given a valid timestamp', async () => {
  const app = new App().getServer();
  const [vehicle] = (await database('vehicles')
    .insert({
      make: 'BMW',
      model: 'X1',
      state: 'sold',
    } as Partial<Vehicle>)
    .returning('*')) as Vehicle[];

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'quoted',
    timestamp: "2022-08-10 11:10:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'selling',
    timestamp: "2022-08-20 09:23:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'sold',
    timestamp: "2022-09-12 10:00:00+00'",
  } as Partial<StateLog>);

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

it('should return vehicle not found if vehicle doest not exists', async () => {
  const app = new App().getServer();
  const [vehicle] = (await database('vehicles')
    .insert({
      make: 'BMW',
      model: 'X1',
      state: 'sold',
    } as Partial<Vehicle>)
    .returning('*')) as Vehicle[];

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'quoted',
    timestamp: "2022-08-10 11:10:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'selling',
    timestamp: "2022-08-20 09:23:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: vehicle.id,
    state: 'sold',
    timestamp: "2022-09-12 10:00:00+00'",
  } as Partial<StateLog>);

  const targetDate = '2022-08-22 10:00:00+00';
  const response = await request(app)
    .get(`/vehicles/1000?timestamp=${encodeURIComponent(targetDate)}`)
    .expect('Content-Type', /json/);

  expect(response.statusCode).toEqual(404);
  expect(response.body).toEqual({
    status: 404,
    error: {
      code: 'RESOURCE_MISSING',
      type: 'NOT_FOUND_EXCEPTION',
      message: `Vehicle 1000 not found`,
      param: 'id',
    },
  });
});

it('should return state log not found if vehicle exist but state log does not', async () => {
  const app = new App().getServer();
  await database('vehicles')
    .insert({
      make: 'BMW',
      model: 'X1',
      state: 'sold',
    } as Partial<Vehicle>)
    .returning('*');

  await database('stateLogs').insert({
    vehicleId: 1000,
    state: 'quoted',
    timestamp: "2022-08-10 11:10:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: 1000,
    state: 'selling',
    timestamp: "2022-08-20 09:23:00+00'",
  } as Partial<StateLog>);

  await database('stateLogs').insert({
    vehicleId: 1000,
    state: 'sold',
    timestamp: "2022-09-12 10:00:00+00'",
  } as Partial<StateLog>);

  const targetDate = '2022-08-22 10:00:00+00';
  const response = await request(app)
    .get(`/vehicles/1?timestamp=${encodeURIComponent(targetDate)}`)
    .expect('Content-Type', /json/);

  expect(response.statusCode).toEqual(404);
  expect(response.body).toEqual({
    status: 404,
    error: {
      code: 'RESOURCE_MISSING',
      type: 'NOT_FOUND_EXCEPTION',
      message: `State log for vehicle 1 not found`,
      param: 'id',
    },
  });
});
