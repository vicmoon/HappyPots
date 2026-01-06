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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Plant Library</h1>

      <PlantSearch onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {plants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          {isLoading ? (
            <p>Searching plants...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Search for plants to get started!</p>
              <p className="text-sm">
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
