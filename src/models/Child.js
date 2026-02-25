/**
 * Child model - linked to parent, has secure QR ID and emergency contacts.
 */

const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, trim: true },
  },
  { _id: false }
);

const childSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 25,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 5,
        message: 'Maximum 5 emergency contacts allowed.',
      },
    },
    // Secure unguessable ID used in QR and public scan URL
    secureId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Child = mongoose.model('Child', childSchema);
module.exports = Child;
