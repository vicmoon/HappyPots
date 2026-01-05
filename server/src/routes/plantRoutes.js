const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchPlants,
  getPlantDetails,
  getUserPlants,
  addPlantToGarden,
  updateUserPlant,
  removeFromGarden,
  getCareLogs,
  addCareLog,
} = require('../controllers/plantController');

// Public routes
router.get('/search', searchPlants);
router.get('/:id', getPlantDetails);

// Protected routes
router.use(protect);
router.get('/garden/my-plants', getUserPlants);
router.post('/garden', addPlantToGarden);
router.put('/garden/:id', updateUserPlant);
router.delete('/garden/:id', removeFromGarden);
router.get('/garden/:plantId/care-logs', getCareLogs);
router.post('/garden/:plantId/care-logs', addCareLog);

module.exports = router;
