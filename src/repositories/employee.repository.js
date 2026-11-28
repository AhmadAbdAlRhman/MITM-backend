const db = require('../config/db');

// The database table is named 'employess' (double-s) — a pre-existing schema typo.
// The invoice query joins against a separate 'employees' table (correct spelling).
// Do not rename without an approved schema migration covering all dependent objects.
const TABLE = 'employess';

async function findByEmployeeCode(employeeCode) {
  const [rows] = await db.execute(
    `SELECT * FROM ${TABLE} WHERE employee_code = ?`,
    [employeeCode],
  );
  return rows[0] ?? null;
}

module.exports = { findByEmployeeCode };
