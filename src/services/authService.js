/**
 * Authentication service - register, login, JWT.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

async function registerParent({ email, password, name, phone }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('User already exists with this email.');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name: name || '',
    phone: phone || '',
    role: 'parent',
  });
  const token = generateToken(user);
  return { user: user.toJSON(), token };
}

async function loginParent(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }
  const match = await user.comparePassword(password);
  if (!match) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }
  user.password = undefined;
  const token = generateToken(user);
  return { user: user.toJSON(), token };
}

async function updateProfile(userId, updates) {
  const allowed = ['name', 'phone'];
  const payload = {};
  allowed.forEach((k) => {
    if (updates[k] !== undefined) payload[k] = updates[k];
  });
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user.toJSON();
}

module.exports = {
  generateToken,
  registerParent,
  loginParent,
  updateProfile,
};
