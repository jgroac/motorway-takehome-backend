import database from '../database/db';

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
