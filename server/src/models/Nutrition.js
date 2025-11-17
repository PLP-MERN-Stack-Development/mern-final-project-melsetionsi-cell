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
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
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
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
nutritionSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((total, item) => total + item.calories, 0);
  this.totalProtein = this.foodItems.reduce((total, item) => total + item.protein, 0);
  this.totalCarbs = this.foodItems.reduce((total, item) => total + item.carbs, 0);
  this.totalFat = this.foodItems.reduce((total, item) => total + item.fat, 0);
  next();
});

module.exports = mongoose.model('Nutrition', nutritionSchema);