const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');
const requestId = require('../src/middleware/requestId.middleware');

function buildLimitedApp(max) {
  const app = express();
  app.use(requestId);
  app.use(
    rateLimit({
      windowMs: 60_000,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests. Please try again later.' },
    }),
  );
  app.get('/test', (_req, res) => res.json({ success: true }));
  return app;
}

describe('Rate limiting', () => {
  it('allows requests within the limit', async () => {
    const app = buildLimitedApp(5);

    const res = await request(app).get('/test');

    expect(res.status).toBe(200);
  });

  it('blocks requests exceeding the limit', async () => {
    const app = buildLimitedApp(2);

    await request(app).get('/test');
    await request(app).get('/test');
    const res = await request(app).get('/test');

    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({ success: false });
  });

  it('sets RateLimit-* headers', async () => {
    const app = buildLimitedApp(10);

    const res = await request(app).get('/test');

    expect(res.headers['ratelimit-limit']).toBeDefined();
    expect(res.headers['ratelimit-remaining']).toBeDefined();
  });
});
