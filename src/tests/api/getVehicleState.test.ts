import { App } from '../../app';
import request from 'supertest';
import database from '../../database/db';
import { StateLog, Vehicle } from '../../database/models';
import cases from 'jest-in-case';

it('should return the correct vehicle state when vehicle exists and given a valid timestamp', async () => {
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

cases(
  'should return validation error if values provided are invalid:',
  async (testCase) => {
    const app = new App().getServer();

    const response = await request(app)
      .get(
        `/vehicles/${testCase.params.id ?? ''}?timestamp=${
          testCase.params?.timestamp ?? ''
        }`,
      )
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(testCase.expectedResponse.status);
    expect(response.body).toEqual(testCase.expectedResponse);
  },
  {
    'non numeric vehicle id': {
      params: {
        id: 'non-numeric',
        timestamp: encodeURIComponent('2022-08-22 10:00:00+00'),
      },
      expectedResponse: {
        status: 400,
        error: {
          code: 'INVALID_PARAMS',
          type: 'INVALID_REQUEST_EXCEPTION',
          message: `id should be numeric`,
          param: 'id',
        },
      },
    },
    'negative vehicle id': {
      params: {
        id: '-1',
        timestamp: encodeURIComponent('2022-08-22 10:00:00+00'),
      },
      expectedResponse: {
        status: 400,
        error: {
          code: 'INVALID_PARAMS',
          type: 'INVALID_REQUEST_EXCEPTION',
          message: `id must be positive`,
          param: 'id',
        },
      },
    },
    'missing timestamp': {
      params: {
        id: '1',
      },
      expectedResponse: {
        status: 400,
        error: {
          code: 'INVALID_PARAMS',
          type: 'INVALID_REQUEST_EXCEPTION',
          message: `timestamp is required`,
          param: 'timestamp',
        },
      },
    },
    'invalid timestamp format': {
      params: {
        id: '1',
        timestamp: 'non valid date',
      },
      expectedResponse: {
        status: 400,
        error: {
          code: 'INVALID_PARAMS',
          type: 'INVALID_REQUEST_EXCEPTION',
          message: `timestamp must be a date formatted as YYYY-MM-DD HH:mm:ss ZZ`,
          param: 'timestamp',
        },
      },
    },
  },
);
