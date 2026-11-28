const db = require('../config/db');

async function findAllWithEmployee() {
  const [rows] = await db.execute(
    `SELECT i.invoice_number,
            i.amount,
            i.description,
            i.payment_status,
            e.full_name AS employee_name
     FROM invoices i
     JOIN employees e ON e.id = i.employee_id`,
  );
  return rows;
}

module.exports = { findAllWithEmployee };
