// src/controllers/plantController.js
const plantService = require('../services/plantService');
const UserPlant = require('../models/UserPlant');
const CareLog = require('../models/CareLog');
const Plant = require('../models/Plant');

/**
 * Public - Search plants (calls Trefle via plantService)
 * GET /api/plants/search?q=...
 */
const searchPlants = async (req, res, next) => {
  const q = req.query.q;
  const page = req.query.page || 1;
  console.log(
    `[${new Date().toISOString()}] [PlantSearch] incoming query="${q}", page=${page}`
  );

  if (!q) {
    return res
      .status(400)
      .json({ success: false, error: 'Search query is required' });
  }

  try {
    const results = await plantService.searchAndCachePlants(q, page);
    // Ensure we always return an array
    const data = Array.isArray(results) ? results : [];
    return res.status(200).json({ success: true, data });
  } catch (err) {
    // If service attaches a status (e.g., 504) surface it:
    if (err && err.status === 504) {
      console.error(`[PlantSearch] upstream timed out: ${err.message || err}`);
      return res
        .status(504)
        .json({ success: false, error: 'Upstream API timed out' });
    }
    if (err && err.status === 502) {
      console.error(`[PlantSearch] upstream error: ${err.message || err}`);
      return res
        .status(502)
        .json({ success: false, error: 'Upstream API error' });
    }
    console.error(
      '[PlantSearch] unexpected error:',
      err && err.stack ? err.stack : err
    );
    return next(err);
  }
};

/**
 * Public - Get plant details (Trefle or cached)
 * GET /api/plants/:id
 */
const getPlantDetails = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[${new Date().toISOString()}] [PlantDetails] request id=${id}`);

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: 'Plant id is required' });
  }

  try {
    const plant = await plantService.getPlantDetails(id);
    return res.status(200).json({ success: true, data: plant });
  } catch (err) {
    if (err && err.status === 404) {
      return res.status(404).json({ success: false, error: 'Plant not found' });
    }
    if (err && err.status === 504) {
      return res
        .status(504)
        .json({ success: false, error: 'Upstream API timed out' });
    }
    console.error('[PlantDetails] error:', err && err.stack ? err.stack : err);
    return next(err);
  }
};

/**
 * Protected - list user's plants in garden
 * GET /api/plants/garden/my-plants
 */
const getUserPlants = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });

    const userPlants = await UserPlant.findAll({
      where: { user_id: userId },
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

    return res.status(200).json({ success: true, data: userPlants });
  } catch (err) {
    console.error('[getUserPlants] error:', err && err.stack ? err.stack : err);
    return next(err);
  }
};

/**
 * Protected - add a plant to user's garden (fetch & cache from Trefle if needed)
 * POST /api/plants/garden
 * body: { trefle_id, nickname, location, acquired_date, notes }
 */
const addPlantToGarden = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { trefle_id, nickname, location, acquired_date, notes } = req.body;
    if (!trefle_id)
      return res
        .status(400)
        .json({ success: false, error: 'Plant ID is required' });

    // Fetch from Trefle and cache in DB (plantService handles caching/upsert)
    const plant = await plantService.getOrCachePlant(trefle_id);

    // Create UserPlant linking to the cached Plant (use plant.id or plant.trefle_id depending on schema)
    const userPlant = await UserPlant.create({
      user_id: userId,
      plant_id: plant.id, // adjust to plant.trefle_id if your FK uses that
      nickname,
      location,
      acquired_date,
      notes,
    });

    const fullUserPlant = await UserPlant.findByPk(userPlant.id, {
      include: [Plant],
    });
    return res.status(201).json({ success: true, data: fullUserPlant });
  } catch (err) {
    console.error(
      '[addPlantToGarden] error:',
      err && err.stack ? err.stack : err
    );
    return next(err);
  }
};

/**
 * Protected - update user's plant entry
 * PUT /api/plants/garden/:id
 */
const updateUserPlant = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const { nickname, location, acquired_date, notes } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });

    const userPlant = await UserPlant.findOne({
      where: { id, user_id: userId },
    });
    if (!userPlant)
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found in your garden' });

    await userPlant.update({ nickname, location, acquired_date, notes });

    const updatedPlant = await UserPlant.findByPk(id, { include: [Plant] });
    return res.status(200).json({ success: true, data: updatedPlant });
  } catch (err) {
    console.error(
      '[updateUserPlant] error:',
      err && err.stack ? err.stack : err
    );
    return next(err);
  }
};

/**
 * Protected - remove plant from garden
 * DELETE /api/plants/garden/:id
 */
const removeFromGarden = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });

    const userPlant = await UserPlant.findOne({
      where: { id, user_id: userId },
    });
    if (!userPlant)
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found in your garden' });

    await userPlant.destroy();
    return res
      .status(200)
      .json({ success: true, message: 'Plant removed from garden' });
  } catch (err) {
    console.error(
      '[removeFromGarden] error:',
      err && err.stack ? err.stack : err
    );
    return next(err);
  }
};

/**
 * Protected - get care logs for a user plant
 * GET /api/plants/garden/:plantId/care-logs
 */
const getCareLogs = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { plantId } = req.params;

    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });

    const userPlant = await UserPlant.findOne({
      where: { id: plantId, user_id: userId },
    });
    if (!userPlant)
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found in your garden' });

    const careLogs = await CareLog.findAll({
      where: { user_plant_id: plantId },
      order: [['log_date', 'DESC']],
    });
    return res.status(200).json({ success: true, data: careLogs });
  } catch (err) {
    console.error('[getCareLogs] error:', err && err.stack ? err.stack : err);
    return next(err);
  }
};

/**
 * Protected - add a care log
 * POST /api/plants/garden/:plantId/care-logs
 * body: { action, notes, log_date }
 */
const addCareLog = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { plantId } = req.params;
    const { action, notes, log_date } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    const userPlant = await UserPlant.findOne({
      where: { id: plantId, user_id: userId },
    });
    if (!userPlant)
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found in your garden' });

    if (!action)
      return res
        .status(400)
        .json({ success: false, error: 'Action is required' });

    const careLog = await CareLog.create({
      user_plant_id: plantId,
      action,
      notes,
      log_date: log_date || new Date(),
    });

    return res.status(201).json({ success: true, data: careLog });
  } catch (err) {
    console.error('[addCareLog] error:', err && err.stack ? err.stack : err);
    return next(err);
  }
};

module.exports = {
  searchPlants,
  getPlantDetails,
  getUserPlants,
  addPlantToGarden,
  updateUserPlant,
  removeFromGarden,
  getCareLogs,
  addCareLog,
};
