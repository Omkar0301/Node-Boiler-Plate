const redis = require('redis');
const logger = require('../utils/logger');
const config = require('../config');

let redisClient;

if (config.redis.enabled) {
  const redisOptions = {
    socket: {
      host: config.redis.host,
      port: config.redis.port
    },
    database: config.redis.db
  };

  if (config.redis.password) {
    redisOptions.password = config.redis.password;
  }

  redisClient = redis.createClient(redisOptions);

  redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis');
  });

  redisClient.on('ready', () => {
    logger.info('Redis connection is ready');
  });

  redisClient.on('end', () => {
    logger.warn('Redis connection ended');
  });

  const connectRedis = async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      logger.error(`Redis connection failed: ${err}`);
    }
  };

  module.exports = {
    redisClient,
    connectRedis
  };
} else {
  // Mock Redis client when disabled
  const mockRedis = {
    get: async () => null,
    set: async () => undefined,
    del: async () => undefined,
    keys: async () => [],
    disconnect: async () => undefined
  };

  module.exports = {
    redisClient: mockRedis,
    connectRedis: async () => {
      logger.info('Redis is disabled - using mock client');
    }
  };
}
