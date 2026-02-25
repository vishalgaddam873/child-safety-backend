/**
 * Auth routes - register, login, profile.
 */

const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').optional().trim(),
    body('phone').optional().trim(),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  authController.login
);

router.get('/me', protect, authController.getMe);

router.patch(
  '/profile',
  protect,
  [
    body('name').optional().trim(),
    body('phone').optional().trim(),
  ],
  validate,
  authController.updateProfile
);

module.exports = router;
