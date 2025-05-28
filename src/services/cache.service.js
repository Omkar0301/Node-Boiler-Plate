const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');
const config = require('../config');

class CacheService {
  async get(key) {
    if (!config.redis.enabled) return null;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        logger.debug(`Cache hit for key: ${key}`);
        return JSON.parse(cachedData);
      }
      return null;
    } catch (error) {
      logger.error(`Redis get error: ${error}`);
      return null;
    }
  }

  async set(key, value, ttl = config.redis.ttl) {
    if (!config.redis.enabled) return;

    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttl
      });
      logger.debug(`Cache set for key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
      logger.error(`Redis set error: ${error}`);
    }
  }

  async delete(key) {
    if (!config.redis.enabled) return;

    try {
      await redisClient.del(key);
      logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Redis delete error: ${error}`);
    }
  }

  async deleteByPattern(pattern) {
    if (!config.redis.enabled) return;

    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.debug(`Cache deleted for ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      logger.error(`Redis deleteByPattern error: ${error}`);
    }
  }

  async flushAll() {
    if (!config.redis.enabled) return;

    try {
      await redisClient.flushAll();
      logger.warn('Redis cache flushed');
    } catch (error) {
      logger.error(`Redis flushAll error: ${error}`);
    }
  }
}

module.exports = new CacheService();
