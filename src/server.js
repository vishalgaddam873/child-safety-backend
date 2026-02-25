/**
 * Entry point: connect MongoDB, mount Socket.io, start HTTP server.
 */

const http = require('http');
const mongoose = require('mongoose');
const { Server: SocketServer } = require('socket.io');
const config = require('./config');
const app = require('./app');
const { attachSocketServer } = require('./sockets');

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: { origin: config.cors.origins, credentials: true },
  path: '/socket.io',
});
const socketHandler = attachSocketServer(io);
app.set('io', socketHandler);

mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
