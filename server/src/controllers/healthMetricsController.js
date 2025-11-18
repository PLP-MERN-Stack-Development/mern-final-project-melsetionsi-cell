const HealthMetrics = require('../models/HealthMetrics');

// @desc    Get all health metrics for user
// @route   GET /api/health-metrics
// @access  Private
exports.getHealthMetrics = async (req, res, next) => {
  try {
    const { startDate, endDate, limit } = req.query;
    
    let query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let metricsQuery = HealthMetrics.find(query).sort({ date: -1 });
    
    if (limit) {
      metricsQuery = metricsQuery.limit(parseInt(limit));
    }
    
    const healthMetrics = await metricsQuery;

    res.status(200).json({
      success: true,
      count: healthMetrics.length,
      data: healthMetrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single health metric
// @route   GET /api/health-metrics/:id
// @access  Private
exports.getHealthMetric = async (req, res, next) => {
  try {
    const healthMetric = await HealthMetrics.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!healthMetric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.status(200).json({
      success: true,
      data: healthMetric
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create health metric
// @route   POST /api/health-metrics
// @access  Private
exports.createHealthMetric = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const healthMetric = await HealthMetrics.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Health metric created successfully',
      data: healthMetric
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update health metric
// @route   PUT /api/health-metrics/:id
// @access  Private
exports.updateHealthMetric = async (req, res, next) => {
  try {
    let healthMetric = await HealthMetrics.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!healthMetric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    healthMetric = await HealthMetrics.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Health metric updated successfully',
      data: healthMetric
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete health metric
// @route   DELETE /api/health-metrics/:id
// @access  Private
exports.deleteHealthMetric = async (req, res, next) => {
  try {
    const healthMetric = await HealthMetrics.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!healthMetric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    await HealthMetrics.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Health metric deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get health metrics statistics and trends
// @route   GET /api/health-metrics/stats/trends
// @access  Private
exports.getHealthTrends = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const weightTrends = await HealthMetrics.find({
      user: req.user.id,
      date: { $gte: startDate },
      weight: { $exists: true, $ne: null }
    })
    .sort({ date: 1 })
    .select('date weight -_id');

    const bmiTrends = await HealthMetrics.find({
      user: req.user.id,
      date: { $gte: startDate },
      bmi: { $exists: true, $ne: null }
    })
    .sort({ date: 1 })
    .select('date bmi -_id');

    const sleepTrends = await HealthMetrics.find({
      user: req.user.id,
      date: { $gte: startDate },
      sleepDuration: { $exists: true, $ne: null }
    })
    .sort({ date: 1 })
    .select('date sleepDuration -_id');

    const latestMetrics = await HealthMetrics.findOne({
      user: req.user.id
    })
    .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        weightTrends,
        bmiTrends,
        sleepTrends,
        latestMetrics
      }
    });
  } catch (error) {
    next(error);
  }
};
