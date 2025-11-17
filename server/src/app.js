const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Route files
const auth = require('./routes/auth');
const workouts = require('./routes/workouts');
const nutrition = require('./routes/nutrition');
const healthMetrics = require('./routes/healthMetrics');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/workouts', workouts);
app.use('/api/nutrition', nutrition);
app.use('/api/health-metrics', healthMetrics);

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Fitness Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
