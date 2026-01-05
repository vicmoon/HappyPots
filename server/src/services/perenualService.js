const axios = require('axios');
const config = require('../config/config');

class PerenualService {
  constructor() {
    this.baseUrl = config.perenualBaseUrl;
    this.apiKey = config.perenualApiKey;
  }

  async searchPlants(query, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/species-list`, {
        params: {
          key: this.apiKey,
          q: query,
          page: page,
          indoor: 1, // Filter for indoor plants
        },
      });
      return response.data;
    } catch (error) {
      console.error('Perenual API Error:', error.message);
      throw new Error('Failed to search plants from Perenual API');
    }
  }

  async getPlantDetails(perenualId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/species/details/${perenualId}`,
        {
          params: {
            key: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Perenual API Error:', error.message);
      throw new Error('Failed to get plant details from Perenual API');
    }
  }

  async getPlantCareGuide(perenualId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/species-care-guide-list`,
        {
          params: {
            key: this.apiKey,
            species_id: perenualId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Perenual API Error:', error.message);
      throw new Error('Failed to get care guide from Perenual API');
    }
  }
}

module.exports = new PerenualService();
