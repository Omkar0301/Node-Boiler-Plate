const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./index');
const scheduleTokenCleanup = require('../schedulars/tokenCleanupScheduler');

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.url);
    logger.info('Database connection established...');

    if (process.env.NODE_ENV !== 'test') {
      scheduleTokenCleanup();
      logger.info('Token cleanup scheduler initialized');
    }

    return mongoose.connection;
  } catch (err) {
    logger.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
