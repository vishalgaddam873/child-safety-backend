/**
 * Public scan and protected scan history routes.
 */

const express = require('express');
const { body, param } = require('express-validator');
const scanController = require('../controllers/scanController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const scanLimiter = require('../middlewares/rateLimitScan');

const router = express.Router();

// Public: record scan by secureId (used by /scan/[childId] frontend)
router.post(
  '/:secureId',
  scanLimiter,
  [
    param('secureId').isLength({ min: 32, max: 64 }).trim(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    body('accuracy').optional().isFloat({ min: 0 }),
    body('timestamp').optional().isISO8601(),
    body('deviceInfo').optional().isObject(),
    body('deviceInfo.userAgent').optional().isString(),
    body('deviceInfo.platform').optional().isString(),
    body('deviceInfo.language').optional().isString(),
    body('deviceInfo.screenResolution').optional().isString(),
    body('message').optional().isString().trim().isLength({ max: 200 }),
  ],
  validate,
  scanController.scanBySecureId,
  (req, res, next) => {
    if (req.scanPayload && req.app.get('io')) {
      req.app.get('io').emitScanToParent(req.scanPayload);
    }
    res.status(201).json({
      success: true,
      message: 'Scan recorded. Parent has been notified.',
    });
  }
);

// Protected: scan history and last location (use childId = MongoDB _id)
router.get(
  '/child/:childId/history',
  protect,
  [param('childId').isMongoId()],
  validate,
  scanController.getScanHistory
);

router.get(
  '/child/:childId/last',
  protect,
  [param('childId').isMongoId()],
  validate,
  scanController.getLastLocation
);

module.exports = router;
