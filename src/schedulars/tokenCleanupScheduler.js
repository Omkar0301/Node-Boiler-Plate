// schedulers/tokenCleanupScheduler.js
const cron = require('node-cron');
const logger = require('../utils/logger');
const { cleanupOldTokens } = require('../services/token.service');

function scheduleTokenCleanup() {
  // Run every day at 3 AM
  cron.schedule('0 3 * * *', async () => {
    logger.info('Running token cleanup job...');
    try {
      const result = await cleanupOldTokens();
      logger.info(`Cleaned up ${result.deletedCount} old tokens`);
    } catch (error) {
      logger.error('Token cleanup failed:', error);
    }
  });
}

module.exports = scheduleTokenCleanup;
