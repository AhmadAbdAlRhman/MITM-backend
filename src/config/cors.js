const env = require('./env');

// CORS restricts which browser origins can call this API.
// It is enforced by the browser and is NOT a network-level security control.
// Server-to-server requests and tools like curl are unaffected by CORS.
const corsOptions = {
  origin(origin, callback) {
    if (!origin && env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(Object.assign(new Error(`CORS: origin '${origin}' is not allowed`), { status: 403 }));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Experiment-ID'],
  exposedHeaders: ['X-Request-ID'],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
