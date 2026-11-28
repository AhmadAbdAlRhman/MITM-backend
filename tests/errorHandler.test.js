const request  = require('supertest');
const express  = require('express');
const errorHandler = require('../src/middleware/error.middleware');
const requestId    = require('../src/middleware/requestId.middleware');

function buildApp(routeHandler) {
  const app = express();
  app.use(requestId);
  app.get('/test', routeHandler);
  app.use(errorHandler);
  return app;
}

describe('Centralized error handler', () => {
  it('returns 500 for unhandled errors', async () => {
    const app = buildApp((_req, _res, next) => next(new Error('boom')));

    const res = await request(app).get('/test');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ success: false });
  });

  it('respects custom statusCode on error', async () => {
    const app = buildApp((_req, _res, next) => {
      const err = new Error('not allowed');
      err.statusCode = 403;
      next(err);
    });

    const res = await request(app).get('/test');

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ success: false, message: 'not allowed' });
  });

  it('does not expose stack trace in body', async () => {
    const app = buildApp((_req, _res, next) => next(new Error('internal')));

    const res = await request(app).get('/test');

    expect(JSON.stringify(res.body)).not.toMatch(/at Object/);
  });

  it('includes requestId in error response', async () => {
    const app = buildApp((_req, _res, next) => next(new Error('oops')));

    const res = await request(app).get('/test').set('X-Request-ID', 'err-test-id');

    expect(res.body.requestId).toBe('err-test-id');
  });
});
