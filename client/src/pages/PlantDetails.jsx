import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToGarden, setIsAddingToGarden] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  const fetchPlantDetails = async () => {
    try {
      const response = await api.get(`/plants/${id}`);
      setPlant(response.data.data);
    } catch (err) {
      setError('Failed to load plant details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGarden = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setIsAddingToGarden(true);
    try {
      await api.post('/plants/garden', {
        perenual_id: plant.perenual_id,
        nickname: plant.common_name,
      });
      alert('Plant added to your garden!');
      navigate('/my-garden');
    } catch (err) {
      alert('Failed to add plant to garden');
      console.error(err);
    } finally {
      setIsAddingToGarden(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-16">Loading plant details...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  if (!plant) {
    return <div className="text-center py-16">Plant not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-600 hover:text-green-700"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {plant.image_url ? (
              <img
                src={plant.image_url}
                alt={plant.common_name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl">🌱</span>
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {plant.common_name}
            </h1>
            {plant.scientific_name && (
              <p className="text-xl text-gray-500 italic mb-4">
                {plant.scientific_name}
              </p>
            )}

            {plant.family && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Family:</strong> {plant.family}
              </p>
            )}

            <div className="space-y-4 mb-6">
              {plant.watering && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    💧 Watering
                  </h3>
                  <p className="text-gray-600 capitalize">{plant.watering}</p>
                </div>
              )}

              {plant.sunlight && plant.sunlight.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    ☀️ Sunlight
                  </h3>
                  <p className="text-gray-600">{plant.sunlight.join(', ')}</p>
                </div>
              )}

              {plant.origin && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    🌍 Origin
                  </h3>
                  <p className="text-gray-600">{plant.origin}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToGarden}
              disabled={isAddingToGarden}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isAddingToGarden ? 'Adding...' : '+ Add to My Garden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
