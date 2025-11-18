const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Fitness Tracker API is running!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
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
