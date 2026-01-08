import { useState } from 'react';
import PlantSearch from '../components/plants/PlantSearch';
import PlantCard from '../components/plants/PlantCard';
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
      setPlants(response.data.data.data || []);
    } catch (err) {
      setError('Failed to search plants. Please try again.');
      console.error(err);
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
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
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
              <p className="empty-state-subtitle">
                Try searching for "Monstera", "Snake Plant", or "Pothos"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantLibrary;
