const Workout = require('../models/Workout');

// @desc    Get all workouts for user
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create workout
// @route   POST /api/workouts
// @access  Private
exports.createWorkout = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const workout = await Workout.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout statistics
// @route   GET /api/workouts/stats/summary
// @access  Private
exports.getWorkoutStats = async (req, res, next) => {
  try {
    const stats = await Workout.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCaloriesBurned: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    const weeklyStats = await Workout.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          workouts: { $sum: 1 },
          calories: { $sum: '$caloriesBurned' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          totalDuration: 0,
          avgDuration: 0
        },
        weeklyStats
      }
    });
  } catch (error) {
    next(error);
  }
};
