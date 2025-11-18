const mongoose = require('mongoose');

const healthMetricsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weight: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  bmi: {
    type: Number,
    min: 0
  },
  heartRate: {
    type: Number,
    min: 0
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: 0
    },
    diastolic: {
      type: Number,
      min: 0
    }
  },
  sleepDuration: {
    type: Number,
    min: 0,
    max: 24
  },
  steps: {
    type: Number,
    min: 0
  },
  waterIntake: {
    type: Number,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
healthMetricsSchema.index({ user: 1, date: -1 });
healthMetricsSchema.index({ user: 1 });

// Calculate BMI before saving
healthMetricsSchema.pre('save', function(next) {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = this.weight / (heightInMeters * heightInMeters);
    this.bmi = parseFloat(this.bmi.toFixed(2));
  }
  next();
});

module.exports = mongoose.model('HealthMetrics', healthMetricsSchema);
