const Plant = require('../models/Plant');
const perenualService = require('./perenualService');

class PlantService {
  async searchAndCachePlants(query, page = 1) {
    // First, search external API
    const perenualData = await perenualService.searchPlants(query, page);

    // Cache results in our database
    if (perenualData.data && perenualData.data.length > 0) {
      for (const plantData of perenualData.data) {
        await this.cacheOrUpdatePlant(plantData);
      }
    }

    return perenualData;
  }

  async getPlantById(plantId) {
    const plant = await Plant.findByPk(plantId);
    if (!plant) {
      throw new Error('Plant not found');
    }
    return plant;
  }

  async getPlantByPerenualId(perenualId) {
    let plant = await Plant.findOne({ where: { perenual_id: perenualId } });

    // If not cached or outdated (older than 30 days), fetch fresh data
    if (!plant || this.isOutdated(plant.last_updated)) {
      const perenualData = await perenualService.getPlantDetails(perenualId);
      plant = await this.cacheOrUpdatePlant(perenualData);
    }

    return plant;
  }

  async cacheOrUpdatePlant(plantData) {
    const [plant, created] = await Plant.upsert(
      {
        perenual_id: plantData.id,
        common_name: plantData.common_name,
        scientific_name:
          plantData.scientific_name && plantData.scientific_name[0],
        other_names: plantData.other_name || [],
        family: plantData.family,
        origin: plantData.origin && plantData.origin[0],
        type: plantData.type,
        watering: plantData.watering,
        sunlight: plantData.sunlight || [],
        image_url:
          plantData.default_image?.original_url ||
          plantData.default_image?.medium_url,
        cached_data: plantData,
        last_updated: new Date(),
      },
      {
        returning: true,
      }
    );

    return plant;
  }

  isOutdated(lastUpdated) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastUpdated) < thirtyDaysAgo;
  }
}

module.exports = new PlantService();
