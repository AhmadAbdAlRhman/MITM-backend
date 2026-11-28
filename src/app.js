const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');

const corsOptions     = require('./config/cors');
const routes          = require('./routes');
const requestId       = require('./middleware/requestId.middleware');
const requestLogger   = require('./middleware/requestLogger.middleware');
const { apiLimiter }  = require('./middleware/rateLimit.middleware');
const errorHandler    = require('./middleware/error.middleware');
const notFound        = require('./middleware/notFound.middleware');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

app.use(requestId);
app.use(requestLogger);

app.use('/api', apiLimiter);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
