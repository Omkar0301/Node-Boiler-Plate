const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

const env = process.env.NODE_ENV || 'development';

const development = {
  port: process.env.PORT || 8080,
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/boilerplate'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },
  tokenCleanup: {
    daysToKeep: process.env.TOKEN_CLEANUP_DAYS || 2
  },
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL) : 3600, // 1 hour in seconds
    cluster: {
      enabled: process.env.REDIS_CLUSTER_ENABLED === 'true',
      hosts: process.env.REDIS_CLUSTER_HOSTS?.split(',') || [],
      options: process.env.REDIS_CLUSTER_OPTIONS
        ? JSON.parse(process.env.REDIS_CLUSTER_OPTIONS)
        : {}
    }
  }
};

const config = {
  development,
  production: { ...development }, // In production, use env variables only
  test: {
    ...development,
    db: {
      url: process.env.DB_URL || 'mongodb://localhost:27017/boilerplate-test'
    }
  }
};

module.exports = config[env];
