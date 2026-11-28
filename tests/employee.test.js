const request = require('supertest');

jest.mock('../src/config/db', () => ({
  query:   jest.fn(),
  execute: jest.fn(),
}));

const db  = require('../src/config/db');
const app = require('../src/app');

const mockEmployee = {
  id: 1,
  employee_code: 'EMP_1001',
  full_name: 'Alice Demo',
  department: 'Engineering',
};

describe('GET /api/demo/employee', () => {
  it('returns 200 with employee data when found', async () => {
    db.execute.mockResolvedValueOnce([[mockEmployee]]);

    const res = await request(app).get('/api/demo/employee');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: mockEmployee });
  });

  it('returns 404 when employee does not exist', async () => {
    db.execute.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/demo/employee');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, message: 'Employee not found' });
  });

  it('returns 500 on database error', async () => {
    db.execute.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).get('/api/demo/employee');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ success: false });
  });
});
