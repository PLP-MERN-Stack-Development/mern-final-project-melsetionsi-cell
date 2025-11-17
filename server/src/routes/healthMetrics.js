const express = require('express');
const {
  getHealthMetrics,
  getHealthMetric,
  createHealthMetric,
  updateHealthMetric,
  deleteHealthMetric,
  getHealthTrends
} = require('../controllers/healthMetricsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getHealthMetrics)
  .post(createHealthMetric);

router.route('/:id')
  .get(getHealthMetric)
  .put(updateHealthMetric)
  .delete(deleteHealthMetric);

router.get('/stats/trends', getHealthTrends);

module.exports = router;
