const healthService = require('../services/health.service');

async function getHealth(req, res) {
  try {
    await healthService.checkHealth();
    res.json({
      success: true,
      project: 'DataLeak Impact Lab',
      status: 'running',
      database: 'connected',
    });
  } catch {
    res.status(500).json({
      success: false,
      database: 'disconnected',
    });
  }
}

module.exports = { getHealth };
