const { status } = require('http-status');

const sendSuccess = (res, message = '', data = {}, meta = {}, statusCode = status.OK) => {
  if (statusCode === status.NO_CONTENT) {
    return res.status(statusCode).send();
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta
  });
};

const sendError = (res, error) => {
  const statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    errors: error.errors || null,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = { sendSuccess, sendError };
