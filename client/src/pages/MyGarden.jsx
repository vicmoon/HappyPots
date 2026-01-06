import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyGarden = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyPlants();
  }, []);

  const fetchMyPlants = async () => {
    try {
      const response = await api.get('/plants/garden/my-plants');
      setPlants(response.data.data);
    } catch (err) {
      setError('Failed to load your plants');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlant = async (plantId) => {
    if (
      !confirm('Are you sure you want to remove this plant from your garden?')
    ) {
      return;
    }

    try {
      await api.delete(`/plants/garden/${plantId}`);
      setPlants(plants.filter((p) => p.id !== plantId));
    } catch (err) {
      alert('Failed to remove plant');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading your garden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Garden</h1>
        <Link
          to="/library"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Plants
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {plants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">Your garden is empty!</p>
          <p className="text-gray-500 mb-6">
            Start by adding some plants to your collection
          </p>
          <Link
            to="/library"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Plants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((userPlant) => (
            <div
              key={userPlant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {userPlant.Plant?.image_url ? (
                  <img
                    src={userPlant.Plant.image_url}
                    alt={userPlant.nickname || userPlant.Plant.common_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">🌱</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {userPlant.nickname || userPlant.Plant?.common_name}
                </h3>
                {userPlant.Plant?.scientific_name && (
                  <p className="text-sm text-gray-500 italic mb-2">
                    {userPlant.Plant.scientific_name}
                  </p>
                )}
                {userPlant.location && (
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {userPlant.location}
                  </p>
                )}
                {userPlant.notes && (
                  <p className="text-sm text-gray-600 mb-3">
                    {userPlant.notes}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemovePlant(userPlant.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    Remove
                  </button>
                  <Link
                    to={`/plants/${userPlant.Plant?.perenual_id}`}
                    className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGarden;
