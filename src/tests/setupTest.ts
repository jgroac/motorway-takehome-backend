import database from '../database/db';

jest.mock('redis', () => jest.requireActual('redis-mock'));

beforeAll(async () => {
  await database.migrate.latest();
});

afterEach(async () => {
  await database.migrate.rollback();
  await database.migrate.latest();
});

afterAll(async () => {
  await database.migrate.rollback();
  await database.destroy();
});
