/**
 * Encrypt/decrypt sensitive fields (e.g. emergency contact phone).
 */

const CryptoJS = require('crypto-js');
const config = require('../config');

function encrypt(text) {
  if (!text) return text;
  return CryptoJS.AES.encrypt(String(text), config.encryption.key).toString();
}

function decrypt(cipher) {
  if (!cipher) return cipher;
  const bytes = CryptoJS.AES.decrypt(cipher, config.encryption.key);
  return bytes.toString(CryptoJS.enc.Utf8) || null;
}

module.exports = { encrypt, decrypt };
