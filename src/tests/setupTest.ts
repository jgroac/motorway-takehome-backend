import database from '../database/db';

beforeAll(async () => {
  console.log('before all');
  await database.migrate.latest();
});

afterEach(async () => {
  console.log('rollback all');
  await database.migrate.rollback();
});

afterAll(async () => {
  console.log('after all');
  await database.destroy();
});
