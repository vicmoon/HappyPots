import { useState, useEffect } from 'react';
import PlantSearch from './PlantSearch';
import PlantCard from './PlantCard';
import api from '../services/api';
import '../styles/PlantLibrary.css';

const PlantLibrary = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  // 💾 1. Load saved search results when the component mounts
  useEffect(() => {
    const savedPlants = sessionStorage.getItem('lastPlantResults');
    const savedQuery = sessionStorage.getItem('lastPlantQuery');

    if (savedPlants && savedQuery) {
      try {
        setPlants(JSON.parse(savedPlants));
        setLastQuery(savedQuery);
      } catch (e) {
        console.error('Failed to parse saved plants', e);
      }
    }
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/plants/search?q=${encodeURIComponent(query)}`
      );

      // Extract the data array from the response
      const rawData = response.data.success
        ? response.data.data
        : response.data;

      if (!Array.isArray(rawData)) {
        setPlants([]);
        setIsLoading(false);
        return;
      }

      // Normalize the data to ensure only primitives are passed to PlantCard
      const normalized = rawData.map((plant) => ({
        id: plant.id,
        common_name: plant.common_name || 'Unknown Plant',
        scientific_name: plant.scientific_name,
        image_url: plant.image_url,
        family:
          typeof plant.family === 'object' ? plant.family?.name : plant.family,
        genus:
          typeof plant.genus === 'object' ? plant.genus?.name : plant.genus,
        // Flatten growth attributes to primitives
        light: plant.growth?.light,
        atmospheric_humidity: plant.growth?.atmospheric_humidity,
      }));

      setPlants(normalized);
      setLastQuery(query);

      // Change localStorage to sessionStorage
      sessionStorage.setItem('lastPlantResults', JSON.stringify(normalized));
      sessionStorage.setItem('lastPlantQuery', query);
    } catch (err) {
      setError('Failed to search plants. Please try again.');
      console.error('Search error:', err);
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
        <>
          <p className="results-count">
            Showing results for "{lastQuery}" ({plants.length} plants)
          </p>
          <div className="plants-grid">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          {isLoading ? (
            <p>Searching plants...</p>
          ) : (
            <p>Search for plants to get started!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantLibrary;
