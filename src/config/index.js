/**
 * Central configuration for the Child Safety QR Backend.
 * Loads from environment variables with sensible defaults.
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/child-safety-qr',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY || 'default-32-char-encryption-key!!',
  },

  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:3000'],
  },

  rateLimit: {
    scanMax: parseInt(process.env.SCAN_RATE_LIMIT_MAX, 10) || 30,
    scanWindowMs: 15 * 60 * 1000, // 15 minutes
  },

  upload: {
    maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 5,
  },
};

module.exports = config;
