/**
 * Generate cryptographically secure unguessable IDs for children (QR/public URLs).
 */

const crypto = require('crypto');

const ID_LENGTH = 32; // bytes -> 64 hex chars

function generateSecureId() {
  return crypto.randomBytes(ID_LENGTH).toString('hex');
}

module.exports = { generateSecureId };
