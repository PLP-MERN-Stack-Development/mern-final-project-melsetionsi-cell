const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  }
});

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    index: true
  },
  foodItems: [foodItemSchema],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
nutritionSchema.index({ user: 1, date: -1 });
nutritionSchema.index({ mealType: 1 });
nutritionSchema.index({ user: 1, mealType: 1 });

// Calculate totals before saving
nutritionSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((total, item) => total + (item.calories * item.quantity), 0);
  this.totalProtein = this.foodItems.reduce((total, item) => total + (item.protein * item.quantity), 0);
  this.totalCarbs = this.foodItems.reduce((total, item) => total + (item.carbs * item.quantity), 0);
  this.totalFat = this.foodItems.reduce((total, item) => total + (item.fat * item.quantity), 0);
  next();
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
