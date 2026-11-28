const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

function currentLevel() {
  return LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;
}

const SENSITIVE_KEYS = new Set([
  'password', 'authorization', 'token', 'cookie', 'secret', 'credential',
]);

function redact(obj, depth = 0) {
  if (depth > 3 || obj === null || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : redact(v, depth + 1);
  }
  return out;
}

function log(level, message, meta = {}) {
  if ((LEVELS[level] ?? 99) > currentLevel()) return;
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...redact(meta),
  });
  if (level === 'error' || level === 'warn') {
    process.stderr.write(entry + '\n');
  } else {
    process.stdout.write(entry + '\n');
  }
}

module.exports = {
  error: (msg, meta) => log('error', msg, meta),
  warn:  (msg, meta) => log('warn',  msg, meta),
  info:  (msg, meta) => log('info',  msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
};
