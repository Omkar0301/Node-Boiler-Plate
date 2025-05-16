const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const constants = require('./constants');

/**
 * Generate random token
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare passwords
 */
const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Pagination helper
 */
const getPagination = (
  page = constants.PAGINATION.DEFAULT_PAGE,
  limit = constants.PAGINATION.DEFAULT_LIMIT
) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

module.exports = {
  generateRandomToken,
  hashPassword,
  comparePasswords,
  getPagination
};
