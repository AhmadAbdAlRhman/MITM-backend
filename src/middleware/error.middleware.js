const logger = require('../utils/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode ?? err.status ?? 500;

  logger.error('unhandled error', {
    requestId: req.id,
    message: err.message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });

  const message =
    env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id,
  });
}

module.exports = errorHandler;
