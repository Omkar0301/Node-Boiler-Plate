const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
const config = require('./config');
const { errorHandler, errorConverter } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();
const PORT = config.port;

// Connect to Database
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
  })
);
app.use(hpp());
app.use(apiLimiter);

// Logging
app.use((req, res, next) => {
  logger.info(`REQUEST: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1', require('./routes/v1'));

// 404 handler
app.use((req, res, _) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: {
      statusCode: 404,
      message: 'The requested resource was not found.'
    }
  });
});

app.use(errorHandler);
app.use(errorConverter);

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
