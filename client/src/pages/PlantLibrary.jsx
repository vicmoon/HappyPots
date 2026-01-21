import { useState } from 'react';
import PlantSearch from './PlantSearch';
import PlantCard from './PlantCard';
import api from '../services/api';
import '../styles/PlantLibrary.css';

const PlantLibrary = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/plants/search?q=${encodeURIComponent(query)}`
      );

      const rawData = response.data.data;

      if (!Array.isArray(rawData)) {
        console.error('❌ API did not return an array:', rawData);
        setPlants([]);
        setIsLoading(false);
        return;
      }

      // ⭐ Extract ONLY primitive values
      const plantList = rawData
        .filter((plant) => plant && plant.common_name && plant.id)
        .map((plant) => {
          // Extract family name safely
          let familyName = null;
          if (typeof plant.family === 'string') {
            familyName = plant.family;
          } else if (
            plant.family &&
            typeof plant.family === 'object' &&
            plant.family.name
          ) {
            familyName = plant.family.name;
          }

          // Extract genus safely
          let genusName = null;
          if (typeof plant.genus === 'string') {
            genusName = plant.genus;
          } else if (
            plant.genus &&
            typeof plant.genus === 'object' &&
            plant.genus.name
          ) {
            genusName = plant.genus.name;
          }

          return {
            id: plant.id,
            common_name: plant.common_name,
            scientific_name:
              typeof plant.scientific_name === 'string'
                ? plant.scientific_name
                : null,
            image_url:
              typeof plant.image_url === 'string' ? plant.image_url : null,
            family: familyName,
            genus: genusName,
            light:
              typeof plant.growth?.light === 'number'
                ? plant.growth.light
                : null,
            soil_humidity:
              typeof plant.growth?.soil_humidity === 'number'
                ? plant.growth.soil_humidity
                : null,
            atmospheric_humidity:
              typeof plant.growth?.atmospheric_humidity === 'number'
                ? plant.growth.atmospheric_humidity
                : null,
          };
        });

      console.log('✅ Normalized plants:', plantList);

      setPlants(plantList);
    } catch (err) {
      setError('Failed to search plants. Please try again.');
      console.error('❌ Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plant-library-container">
      <h1 className="library-title">Plant Library</h1>

      <PlantSearch onSearch={handleSearch} isLoading={isLoading} />

      {error && <div className="error-message">{error}</div>}

      {plants.length > 0 ? (
        <div className="plants-grid">
          {plants.map((plant, index) => {
            // ⭐ Extra safety check
            if (!plant || typeof plant !== 'object') {
              console.error('❌ Invalid plant at index', index, plant);
              return null;
            }

            // ⭐ Check for raw Trefle objects
            const keys = Object.keys(plant);
            if (keys.includes('slug') || keys.includes('links')) {
              console.error('❌ Skipping raw Trefle object:', plant);
              return null;
            }

            return <PlantCard key={plant.id || index} plant={plant} />;
          })}
        </div>
      ) : (
        <div className="empty-state">
          {isLoading ? (
            <p>Searching plants...</p>
          ) : (
            <div>
              <p className="empty-state-title">
                Search for plants to get started!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantLibrary;
