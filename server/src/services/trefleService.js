const axios = require('axios');
const config = require('../config/config');

class TrefleService {
  constructor() {
    this.baseUrl = config.trefleBaseUrl;
    this.apiKey = config.trefleApiKey;
  }

  async searchPlants(query, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/plants/search`, {
        params: {
          token: this.apiKey,
          q: query,
          page,
        },
      });

      // Trefle returns data directly in response.data
      return response.data.data || [];
    } catch (error) {
      console.error('Trefle API Error:', error.message);
      throw new Error('Failed to search plants from Trefle API');
    }
  }

  async getPlantDetails(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/plants/${id}`, {
        params: {
          token: this.apiKey,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Trefle API Error:', error.message);
      throw new Error('Failed to get plant details from Trefle API');
    }
  }
}

module.exports = new TrefleService();
