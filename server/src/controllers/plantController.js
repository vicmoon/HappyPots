const plantService = require('../services/plantService');
const UserPlant = require('../models/UserPlant');
const CareLog = require('../models/CareLog');
const Plant = require('../models/Plant');

exports.searchPlants = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    // ⭐ Trefle returns clean plant data directly
    const results = await plantService.searchAndCachePlants(q, page);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPlantDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ⭐ Changed from getPlantByPerenualId → getPlantDetails (Trefle uses simple IDs)
    const plant = await plantService.getPlantDetails(id);

    res.status(200).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserPlants = async (req, res, next) => {
  try {
    const userPlants = await UserPlant.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Plant,
          attributes: [
            'id',
            'common_name',
            'scientific_name',
            'image_url',
            'watering',
            'sunlight',
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: userPlants,
    });
  } catch (error) {
    next(error);
  }
};

exports.addPlantToGarden = async (req, res, next) => {
  try {
    const { trefle_id, nickname, location, acquired_date, notes } = req.body;

    if (!trefle_id) {
      return res.status(400).json({
        success: false,
        error: 'Plant ID is required',
      });
    }

    // ⭐ Fetch plant from Trefle and cache it
    const plant = await plantService.getOrCachePlant(trefle_id);

    // Add to user's garden
    const userPlant = await UserPlant.create({
      user_id: req.user.id,
      plant_id: plant.id,
      nickname,
      location,
      acquired_date,
      notes,
    });

    const fullUserPlant = await UserPlant.findByPk(userPlant.id, {
      include: [Plant],
    });

    res.status(201).json({
      success: true,
      data: fullUserPlant,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserPlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nickname, location, acquired_date, notes } = req.body;

    const userPlant = await UserPlant.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!userPlant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found in your garden',
      });
    }

    await userPlant.update({
      nickname,
      location,
      acquired_date,
      notes,
    });

    const updatedPlant = await UserPlant.findByPk(id, {
      include: [Plant],
    });

    res.status(200).json({
      success: true,
      data: updatedPlant,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromGarden = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userPlant = await UserPlant.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!userPlant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found in your garden',
      });
    }

    await userPlant.destroy();

    res.status(200).json({
      success: true,
      message: 'Plant removed from garden',
    });
  } catch (error) {
    next(error);
  }
};

exports.getCareLogs = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    // Verify the plant belongs to the user
    const userPlant = await UserPlant.findOne({
      where: { id: plantId, user_id: req.user.id },
    });

    if (!userPlant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found in your garden',
      });
    }

    const careLogs = await CareLog.findAll({
      where: { user_plant_id: plantId },
      order: [['log_date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: careLogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCareLog = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const { action, notes, log_date } = req.body;

    // Verify the plant belongs to the user
    const userPlant = await UserPlant.findOne({
      where: { id: plantId, user_id: req.user.id },
    });

    if (!userPlant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found in your garden',
      });
    }

    if (!action) {
      return res.status(400).json({
        success: false,
        error: 'Action is required',
      });
    }

    const careLog = await CareLog.create({
      user_plant_id: plantId,
      action,
      notes,
      log_date: log_date || new Date(),
    });

    res.status(201).json({
      success: true,
      data: careLog,
    });
  } catch (error) {
    next(error);
  }
};
