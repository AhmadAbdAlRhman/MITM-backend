const request = require('supertest');

jest.mock('../src/config/db', () => ({
  query:   jest.fn(),
  execute: jest.fn(),
}));

const db  = require('../src/config/db');
const app = require('../src/app');

const mockInvoices = [
  {
    invoice_number: 'INV-001',
    amount: 1500.00,
    description: 'Consulting services',
    payment_status: 'paid',
    employee_name: 'Alice Demo',
  },
];

describe('GET /api/demo/invoices', () => {
  it('returns 200 with invoice list', async () => {
    db.execute.mockResolvedValueOnce([mockInvoices]);

    const res = await request(app).get('/api/demo/invoices');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      count: 1,
      data: mockInvoices,
    });
  });

  it('returns 200 with empty list when no invoices exist', async () => {
    db.execute.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/demo/invoices');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, count: 0, data: [] });
  });

  it('returns 500 on database error', async () => {
    db.execute.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).get('/api/demo/invoices');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ success: false });
  });
});
