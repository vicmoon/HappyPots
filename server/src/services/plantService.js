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
    const normalizeArray = (v) => {
      if (!v) return [];
      return Array.isArray(v) ? v : [v];
    };

    const truncate = (str, maxLength = 50) => {
      if (!str) return null;
      return str.length > maxLength ? str.substring(0, maxLength) : str;
    };

    const [plant] = await Plant.upsert(
      {
        perenual_id: plantData.id,
        common_name: truncate(plantData.common_name, 100),

        scientific_name: Array.isArray(plantData.scientific_name)
          ? truncate(plantData.scientific_name[0], 100)
          : truncate(plantData.scientific_name, 100),

        other_names: normalizeArray(plantData.other_name),

        family: truncate(plantData.family, 50),

        origin: Array.isArray(plantData.origin)
          ? truncate(plantData.origin[0], 100)
          : truncate(plantData.origin, 100),

        type: truncate(plantData.type, 50),

        // ⭐ Truncate the "upgrade" message
        watering: truncate(plantData.watering, 50),

        sunlight: normalizeArray(plantData.sunlight),

        image_url:
          plantData.default_image?.original_url ||
          plantData.default_image?.medium_url,

        cached_data: plantData,
        last_updated: new Date(),
      },
      { returning: true }
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
