const TrefleService = require('./trefleService');
const Plant = require('../models/Plant');

class PlantService {
  // Search plants from Trefle API
  async searchAndCachePlants(query, page = 1) {
    try {
      const plants = await TrefleService.searchPlants(query, page);

      // Return normalized data for frontend
      return plants.map((plant) => ({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        image_url: plant.image_url,
        family: plant.family,
        genus: plant.genus,
        growth: plant.growth,
      }));
    } catch (error) {
      console.error('Plant search error:', error);
      throw error;
    }
  }

  // Get plant details from Trefle
  async getPlantDetails(id) {
    try {
      const plant = await TrefleService.getPlantDetails(id);

      return {
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        image_url: plant.image_url,
        family: plant.family,
        genus: plant.genus,
        growth: plant.growth,
      };
    } catch (error) {
      console.error('Plant detail error:', error);
      throw error;
    }
  }

  // Get or cache plant in your database
  async getOrCachePlant(trefleId) {
    try {
      // Check if plant already exists in DB
      let plant = await Plant.findOne({
        where: { trefle_id: trefleId },
      });

      if (plant) {
        return plant;
      }

      // Fetch from Trefle and cache
      const trefleData = await TrefleService.getPlantDetails(trefleId);

      plant = await Plant.create({
        trefle_id: trefleData.id,
        common_name: trefleData.common_name,
        scientific_name: trefleData.scientific_name,
        image_url: trefleData.image_url,
        family: trefleData.family,
        genus: trefleData.genus,
        watering: trefleData.growth?.soil_humidity || null,
        sunlight: trefleData.growth?.light || null,
        cached_data: trefleData,
        last_updated: new Date(),
      });

      return plant;
    } catch (error) {
      console.error('Cache plant error:', error);
      throw error;
    }
  }
}

module.exports = new PlantService();
