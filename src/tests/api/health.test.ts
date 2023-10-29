import { App } from '../../app';
import request from 'supertest';

it('should return app status OK if healthy', async () => {
  const app = new App().getServer();

  const response = await request(app)
    .get('/health')
    .expect('Content-Type', /json/);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual({
    status: 'OK',
  });
});
