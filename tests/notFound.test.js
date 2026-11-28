const request = require('supertest');

jest.mock('../src/config/db', () => ({
  query:   jest.fn(),
  execute: jest.fn(),
}));

const app = require('../src/app');

describe('Not-found handler', () => {
  it('returns 404 for unknown GET routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false });
  });

  it('returns 404 for unknown POST routes', async () => {
    const res = await request(app).post('/api/unknown');

    expect(res.status).toBe(404);
  });

  it('returns 404 for non-api routes', async () => {
    const res = await request(app).get('/completely-unknown');

    expect(res.status).toBe(404);
  });
});
