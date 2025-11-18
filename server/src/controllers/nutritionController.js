const Nutrition = require('../models/Nutrition');

// @desc    Get all nutrition entries for user
// @route   GET /api/nutrition
// @access  Private
exports.getNutritionEntries = async (req, res, next) => {
  try {
    const { date, mealType } = req.query;
    
    let query = { user: req.user.id };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (mealType) {
      query.mealType = mealType;
    }
    
    const nutritionEntries = await Nutrition.find(query)
      .sort({ date: -1, mealType: 1 });

    res.status(200).json({
      success: true,
      count: nutritionEntries.length,
      data: nutritionEntries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single nutrition entry
// @route   GET /api/nutrition/:id
// @access  Private
exports.getNutritionEntry = async (req, res, next) => {
  try {
    const nutritionEntry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: nutritionEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create nutrition entry
// @route   POST /api/nutrition
// @access  Private
exports.createNutritionEntry = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const nutritionEntry = await Nutrition.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Nutrition entry created successfully',
      data: nutritionEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update nutrition entry
// @route   PUT /api/nutrition/:id
// @access  Private
exports.updateNutritionEntry = async (req, res, next) => {
  try {
    let nutritionEntry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    nutritionEntry = await Nutrition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Nutrition entry updated successfully',
      data: nutritionEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete nutrition entry
// @route   DELETE /api/nutrition/:id
// @access  Private
exports.deleteNutritionEntry = async (req, res, next) => {
  try {
    const nutritionEntry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!nutritionEntry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    await Nutrition.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Nutrition entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nutrition statistics
// @route   GET /api/nutrition/stats/summary
// @access  Private
exports.getNutritionStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Nutrition.aggregate([
      {
        $match: { 
          user: req.user._id,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalCalories: { $sum: '$totalCalories' },
          totalProtein: { $sum: '$totalProtein' },
          totalCarbs: { $sum: '$totalCarbs' },
          totalFat: { $sum: '$totalFat' },
          avgCalories: { $avg: '$totalCalories' }
        }
      }
    ]);

    const dailyStats = await Nutrition.aggregate([
      {
        $match: { 
          user: req.user._id,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: '$totalCalories' },
          totalProtein: { $sum: '$totalProtein' },
          totalCarbs: { $sum: '$totalCarbs' },
          totalFat: { $sum: '$totalFat' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || {
          totalEntries: 0,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          avgCalories: 0
        },
        dailyStats
      }
    });
  } catch (error) {
    next(error);
  }
};
