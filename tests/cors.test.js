const request = require('supertest');

jest.mock('../src/config/db', () => ({
  query:   jest.fn(),
  execute: jest.fn(),
}));

const db  = require('../src/config/db');
const app = require('../src/app');

describe('CORS', () => {
  it('allows requests from an allowed origin', async () => {
    db.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('allows requests from the lab frontend origin', async () => {
    db.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://192.168.56.30:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://192.168.56.30:5173');
  });

  it('blocks requests from an unlisted origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://attacker.example.com');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('responds to OPTIONS preflight with 204', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.status).toBe(204);
  });
});
