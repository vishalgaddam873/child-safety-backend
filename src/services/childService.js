/**
 * Child CRUD and photo upload handling.
 */

const Child = require('../models/Child');
const { generateSecureId } = require('../utils/secureId');
const { encrypt, decrypt } = require('../utils/encrypt');

async function createChild(parentId, data) {
  const secureId = generateSecureId();
  const emergencyContacts = (data.emergencyContacts || []).map((ec) => ({
    name: ec.name,
    phone: encrypt(ec.phone),
    relation: ec.relation || '',
  }));
  const child = await Child.create({
    parentId,
    name: data.name,
    age: data.age,
    emergencyContacts,
    secureId,
    photoUrl: data.photoUrl || null,
  });
  return child;
}

async function updateChild(childId, parentId, data) {
  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  if (data.name !== undefined) child.name = data.name;
  if (data.age !== undefined) child.age = data.age;
  if (data.photoUrl !== undefined) child.photoUrl = data.photoUrl;
  if (data.emergencyContacts !== undefined) {
    child.emergencyContacts = data.emergencyContacts.map((ec) => ({
      name: ec.name,
      phone: encrypt(ec.phone),
      relation: ec.relation || '',
    }));
  }
  await child.save();
  return child;
}

async function deleteChild(childId, parentId) {
  const child = await Child.findOneAndDelete({ _id: childId, parentId });
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true };
}

async function getChildren(parentId) {
  const children = await Child.find({ parentId }).sort({ createdAt: -1 }).lean();
  return children.map((c) => ({
    ...c,
    emergencyContacts: (c.emergencyContacts || []).map((ec) => ({
      ...ec,
      phone: decrypt(ec.phone) || ec.phone,
    })),
  }));
}

async function getChildBySecureId(secureId) {
  return Child.findOne({ secureId }).lean();
}

async function getChildByIdAndParent(childId, parentId) {
  const child = await Child.findOne({ _id: childId, parentId }).lean();
  if (!child) return null;
  return {
    ...child,
    emergencyContacts: (child.emergencyContacts || []).map((ec) => ({
      ...ec,
      phone: decrypt(ec.phone) || ec.phone,
    })),
  };
}

async function setChildPhotoUrl(childId, parentId, photoUrl) {
  const child = await Child.findOneAndUpdate(
    { _id: childId, parentId },
    { photoUrl },
    { new: true }
  );
  if (!child) {
    const err = new Error('Child not found.');
    err.statusCode = 404;
    throw err;
  }
  return child;
}

module.exports = {
  createChild,
  updateChild,
  deleteChild,
  getChildren,
  getChildBySecureId,
  getChildByIdAndParent,
  setChildPhotoUrl,
};
