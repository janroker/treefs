import request from 'supertest';
import { createTestApp, type TestApp } from '../../__spec__/support/app';

describe('error responses', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  it('answers an unknown route with an error DTO', async () => {
    const response = await request(testApp.app.getHttpServer()).get(
      '/api/v1/nothing-here',
    );

    expect(response.status).toBe(404);
    expect(response.headers['x-request-id']).toBeTruthy();
    expect(JSON.parse(response.text)).toMatchObject({
      code: 'notFound.routeNotFound',
      statusCode: 404,
    });
  });
});
