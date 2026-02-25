/**
 * Child controller - CRUD and photo upload.
 */

const childService = require('../services/childService');
const path = require('path');
const fs = require('fs').promises;

async function createChild(req, res, next) {
  try {
    const child = await childService.createChild(req.user._id, req.body);
    res.status(201).json({ success: true, child });
  } catch (err) {
    next(err);
  }
}

async function updateChild(req, res, next) {
  try {
    const child = await childService.updateChild(
      req.params.childId,
      req.user._id,
      req.body
    );
    res.json({ success: true, child });
  } catch (err) {
    next(err);
  }
}

async function deleteChild(req, res, next) {
  try {
    await childService.deleteChild(req.params.childId, req.user._id);
    res.json({ success: true, message: 'Child deleted.' });
  } catch (err) {
    next(err);
  }
}

async function getChildren(req, res, next) {
  try {
    const children = await childService.getChildren(req.user._id);
    res.json({ success: true, children });
  } catch (err) {
    next(err);
  }
}

async function getChild(req, res, next) {
  try {
    const child = await childService.getChildByIdAndParent(
      req.params.childId,
      req.user._id
    );
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found.' });
    }
    res.json({ success: true, child });
  } catch (err) {
    next(err);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const photoUrl = `${baseUrl}/${req.file.filename}`;
    const child = await childService.setChildPhotoUrl(
      req.params.childId,
      req.user._id,
      photoUrl
    );
    res.json({ success: true, child, photoUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createChild,
  updateChild,
  deleteChild,
  getChildren,
  getChild,
  uploadPhoto,
};
