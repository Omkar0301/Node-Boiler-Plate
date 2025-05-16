// eslint-disable-next-line no-unused-vars
const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});

const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

module.exports = {
  apiLimiter,
  authLimiter
};
