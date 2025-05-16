// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');

const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
    const message = err.message || status[statusCode];
    err = new ApiError(statusCode, message, false, err.stack);
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
  const message = err.message || status[statusCode];

  res.locals.errorMessage = message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  logger.error(err);

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler
};
