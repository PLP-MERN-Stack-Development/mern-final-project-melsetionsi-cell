const express = require('express');
const {
  getNutritionEntries,
  getNutritionEntry,
  createNutritionEntry,
  updateNutritionEntry,
  deleteNutritionEntry,
  getNutritionStats
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNutritionEntries)
  .post(createNutritionEntry);

router.route('/:id')
  .get(getNutritionEntry)
  .put(updateNutritionEntry)
  .delete(deleteNutritionEntry);

router.get('/stats/summary', getNutritionStats);

module.exports = router;
