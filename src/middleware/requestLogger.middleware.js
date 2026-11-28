const logger = require('../utils/logger');

// Collects request/response metadata for structured logging.
// X-Experiment-ID header is the mitmproxy integration point: the proxy injects
// it on intercepted traffic so experiment sessions can be correlated by ID
// across both proxy logs and backend logs without exposing raw credentials.
function requestLogger(req, res, next) {
  const startAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startAt) / 1_000_000;

    logger.info('http', {
      requestId:    req.id,
      method:       req.method,
      path:         req.path,
      status:       res.statusCode,
      durationMs:   Math.round(durationMs * 100) / 100,
      ip:           req.ip,
      contentLength: res.getHeader('content-length') ?? null,
      experimentId: req.headers['x-experiment-id'] ?? null,
    });
  });

  next();
}

module.exports = requestLogger;
