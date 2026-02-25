/**
 * Socket.io setup: notify parent when QR is scanned.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const PARENT_ROOM_PREFIX = 'parent:';

function getParentRoom(parentId) {
  return `${PARENT_ROOM_PREFIX}${parentId}`;
}

function attachSocketServer(io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const room = getParentRoom(socket.userId);
    socket.join(room);
  });

  return {
    emitScanToParent(payload) {
      const room = getParentRoom(payload.parentId);
      io.to(room).emit('scan', payload);
    },
  };
}

module.exports = { attachSocketServer, getParentRoom };
