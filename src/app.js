/**
 * Express app: middleware, routes, static uploads.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

app.use(cors({ origin: config.cors.origins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/scan', scanRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, message });
});

module.exports = app;
