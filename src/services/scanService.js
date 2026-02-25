/**
 * Scan logging and retrieval.
 */

const crypto = require('crypto');
const ScanLog = require('../models/ScanLog');
const Child = require('../models/Child');

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET || 'salt').digest('hex').slice(0, 32);
}

async function recordScan(childId, data, ip) {
  const child = await Child.findById(childId);
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  const log = await ScanLog.create({
    childId,
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy ?? null,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    deviceInfo: data.deviceInfo || {},
    ipHash: hashIp(ip),
    message: data.message && String(data.message).trim().slice(0, 200) || null,
  });
  return { log, child };
}

async function getScanHistory(childId, parentId, options = {}) {
  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  const limit = Math.min(parseInt(options.limit, 10) || 50, 100);
  const skip = parseInt(options.skip, 10) || 0;
  const logs = await ScanLog.find({ childId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await ScanLog.countDocuments({ childId });
  return { logs, total };
}

async function getLastLocation(childId, parentId) {
  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  const last = await ScanLog.findOne({ childId }).sort({ timestamp: -1 }).lean();
  return last || null;
}

module.exports = {
  recordScan,
  getScanHistory,
  getLastLocation,
  hashIp,
};
