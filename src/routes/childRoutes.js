/**
 * Child CRUD and photo upload routes.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const childController = require('../controllers/childController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const config = require('../config');

const router = express.Router();
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname && path.extname(file.originalname)) || '.jpg';
    cb(null, `child-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname)) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
  },
});

router.use(protect);

router.get('/', childController.getChildren);

router.get('/:childId', childController.getChild);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('age').isInt({ min: 0, max: 25 }),
    body('emergencyContacts').optional().isArray(),
    body('emergencyContacts.*.name').optional().trim(),
    body('emergencyContacts.*.phone').optional().trim(),
    body('emergencyContacts.*.relation').optional().trim(),
  ],
  validate,
  childController.createChild
);

router.patch(
  '/:childId',
  [
    body('name').optional().trim().notEmpty(),
    body('age').optional().isInt({ min: 0, max: 25 }),
    body('emergencyContacts').optional().isArray(),
  ],
  validate,
  childController.updateChild
);

router.delete('/:childId', childController.deleteChild);

router.post(
  '/:childId/photo',
  upload.single('photo'),
  childController.uploadPhoto
);

module.exports = router;
