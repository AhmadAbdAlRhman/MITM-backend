const db = require('../config/db');

async function checkHealth() {
  await db.query('SELECT 1');
}

module.exports = { checkHealth };
