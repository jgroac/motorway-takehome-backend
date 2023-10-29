import database from '../database/db';

beforeAll(async () => {
  await database.migrate.latest();
});

afterEach(async () => {
  await database.migrate.rollback();
});

afterAll(async () => {
  await database.destroy();
});
