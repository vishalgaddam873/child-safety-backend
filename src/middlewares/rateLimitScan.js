/**
 * Rate limit for public scan endpoint to prevent abuse.
 */

const rateLimit = require('express-rate-limit');
const config = require('../config');

const scanLimiter = rateLimit({
  windowMs: config.rateLimit.scanWindowMs,
  max: config.rateLimit.scanMax,
  message: {
    success: false,
    message: 'Too many scan requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = scanLimiter;
