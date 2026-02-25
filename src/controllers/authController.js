/**
 * Auth controller - register, login, update profile.
 */

const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { user, token } = await authService.registerParent({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
    });
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.loginParent(
      req.body.email,
      req.body.password
    );
    res.json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe, updateProfile };
