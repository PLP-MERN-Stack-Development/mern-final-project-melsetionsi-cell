const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exercise name'],
    trim: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide workout name'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['cardio', 'strength', 'flexibility', 'hiit', 'sports'],
    index: true
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number,
    required: true
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: String,
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ type: 1 });
workoutSchema.index({ user: 1, type: 1 });

// Calculate total calories burned before saving
workoutSchema.pre('save', function(next) {
  if (this.exercises && this.exercises.length > 0) {
    this.caloriesBurned = this.exercises.reduce((total, exercise) => {
      return total + (exercise.caloriesBurned || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
