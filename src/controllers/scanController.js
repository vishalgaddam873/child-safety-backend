/**
 * Public scan API and protected scan history APIs.
 */

const scanService = require('../services/scanService');
const childService = require('../services/childService');

async function scanBySecureId(req, res, next) {
  try {
    const { secureId } = req.params;
    const child = await childService.getChildBySecureId(secureId);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child profile not found for this QR code.',
      });
    }
    const { log, child: childDoc } = await scanService.recordScan(
      child._id,
      req.body,
      req.ip
    );
    // Attach to request for socket handler to emit (include message from body so real-time always has it)
    const message = (log.message != null && String(log.message).trim()) ? String(log.message).trim() : (req.body.message && String(req.body.message).trim()) || null;
    req.scanPayload = {
      childId: child._id.toString(),
      parentId: child.parentId.toString(),
      log: {
        _id: log._id,
        latitude: log.latitude,
        longitude: log.longitude,
        accuracy: log.accuracy,
        timestamp: log.timestamp,
        deviceInfo: log.deviceInfo,
        message,
      },
      childName: child.name,
    };
    next(); // pass to route: emit socket then send response
  } catch (err) {
    next(err);
  }
}

async function getScanHistory(req, res, next) {
  try {
    const { logs, total } = await scanService.getScanHistory(
      req.params.childId,
      req.user._id,
      { limit: req.query.limit, skip: req.query.skip }
    );
    res.json({ success: true, logs, total });
  } catch (err) {
    next(err);
  }
}

async function getLastLocation(req, res, next) {
  try {
    const last = await scanService.getLastLocation(
      req.params.childId,
      req.user._id
    );
    res.json({ success: true, lastLocation: last });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  scanBySecureId,
  getScanHistory,
  getLastLocation,
};
