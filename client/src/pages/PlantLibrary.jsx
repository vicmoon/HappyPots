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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedPlants = sessionStorage.getItem('lastPlantResults');
    const savedQuery = sessionStorage.getItem('lastPlantQuery');
    const savedPage = sessionStorage.getItem('lastPlantPage');

    if (savedPlants && savedQuery) {
      setPlants(JSON.parse(savedPlants));
      setLastQuery(savedQuery);
      setCurrentPage(Number(savedPage) || 1);
    }
  }, []);

  const handleSearch = async (query, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/plants/search?q=${encodeURIComponent(query)}&page=${page}`
      );

      const rawData = response.data.success
        ? response.data.data
        : response.data;

      if (!Array.isArray(rawData)) {
        setPlants([]);
        return;
      }

      const normalized = rawData.map((plant) => ({
        id: plant.id,
        common_name: plant.common_name || 'Unknown Plant',
        scientific_name: plant.scientific_name,
        image_url: plant.image_url,
        family:
          typeof plant.family === 'object' ? plant.family?.name : plant.family,
        genus:
          typeof plant.genus === 'object' ? plant.genus?.name : plant.genus,
      }));

      setPlants(normalized);
      setLastQuery(query);
      setCurrentPage(page);

      sessionStorage.setItem('lastPlantResults', JSON.stringify(normalized));
      sessionStorage.setItem('lastPlantQuery', query);
      sessionStorage.setItem('lastPlantPage', page.toString());

      // Scroll to top on page change
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Failed to search plants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plant-library-container">
      <h1 className="library-title">Plant Library</h1>
      <PlantSearch onSearch={(q) => handleSearch(q, 1)} isLoading={isLoading} />

      {error && <div className="error-message">{error}</div>}

      {plants.length > 0 && (
        <>
          <p className="results-count">
            Results for "{lastQuery}" (Page {currentPage})
          </p>
          <div className="plants-grid">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => handleSearch(lastQuery, currentPage - 1)}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-number">Page {currentPage}</span>
            <button
              disabled={plants.length < 20 || isLoading}
              onClick={() => handleSearch(lastQuery, currentPage + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantLibrary;
