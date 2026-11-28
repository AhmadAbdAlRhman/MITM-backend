const request = require('supertest');

jest.mock('../src/config/db', () => ({
  query:   jest.fn(),
  execute: jest.fn(),
}));

const db  = require('../src/config/db');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns 200 with connected status when db is reachable', async () => {
    db.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      project: 'DataLeak Impact Lab',
      status: 'running',
      database: 'connected',
    });
  });

  it('returns 500 with disconnected status when db is unreachable', async () => {
    db.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ success: false, database: 'disconnected' });
  });

  it('sets X-Request-ID header on response', async () => {
    db.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const res = await request(app).get('/api/health');

    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('echoes a client-supplied X-Request-ID', async () => {
    db.query.mockResolvedValueOnce([[{ 1: 1 }]]);

    const res = await request(app)
      .get('/api/health')
      .set('X-Request-ID', 'test-id-123');

    expect(res.headers['x-request-id']).toBe('test-id-123');
  });
});
