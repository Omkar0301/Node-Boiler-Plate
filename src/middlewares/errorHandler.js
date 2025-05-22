// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const { sendError } = require('../utils/response');

const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
    const message = err.message || status[statusCode];
    err = new ApiError(statusCode, message, false, err.stack);
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.locals.errorMessage = err.message;

  logger.error(err);

  return sendError(res, err);
};

module.exports = {
  errorConverter,
  errorHandler
};
