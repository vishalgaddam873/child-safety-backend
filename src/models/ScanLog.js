/**
 * Scan log - stores each QR scan with location and device info.
 */

const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      language: String,
      screenResolution: String,
    },
    ipHash: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

scanLogSchema.index({ childId: 1, timestamp: -1 });
scanLogSchema.index({ timestamp: -1 });

const ScanLog = mongoose.model('ScanLog', scanLogSchema);
module.exports = ScanLog;
