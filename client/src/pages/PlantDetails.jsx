import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/PlantDetails.css';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToGarden, setIsAddingToGarden] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('🔍 PlantDetail mounted with id:', id);
    fetchPlantDetails();
  }, [id]);

  const fetchPlantDetails = async () => {
    try {
      console.log('📡 Fetching plant details for id:', id);
      const response = await api.get(`/plants/${id}`);

      console.log('✅ API Response:', response.data);

      const raw = response.data.data;

      if (!raw) {
        console.error('❌ No data in response');
        setError('Plant details unavailable.');
        setIsLoading(false);
        return;
      }

      // ⭐ Extract family name safely
      let familyName = null;
      if (typeof raw.family === 'string') {
        familyName = raw.family;
      } else if (
        raw.family &&
        typeof raw.family === 'object' &&
        raw.family.name
      ) {
        familyName = raw.family.name;
      }

      // ⭐ Extract genus name safely
      let genusName = null;
      if (typeof raw.genus === 'string') {
        genusName = raw.genus;
      } else if (raw.genus && typeof raw.genus === 'object' && raw.genus.name) {
        genusName = raw.genus.name;
      }

      // ⭐ Normalize data - ONLY primitives
      const normalized = {
        id: raw.id,
        common_name: raw.common_name || 'Unknown',
        scientific_name:
          typeof raw.scientific_name === 'string'
            ? raw.scientific_name
            : 'Unknown',
        image_url: typeof raw.image_url === 'string' ? raw.image_url : null,
        family: familyName,
        genus: genusName,
        light: typeof raw.growth?.light === 'number' ? raw.growth.light : null,
        soil_humidity:
          typeof raw.growth?.soil_humidity === 'number'
            ? raw.growth.soil_humidity
            : null,
        atmospheric_humidity:
          typeof raw.growth?.atmospheric_humidity === 'number'
            ? raw.growth.atmospheric_humidity
            : null,
        temperature_min:
          typeof raw.growth?.temperature_min === 'number'
            ? raw.growth.temperature_min
            : null,
        temperature_max:
          typeof raw.growth?.temperature_max === 'number'
            ? raw.growth.temperature_max
            : null,
      };

      console.log('✅ Normalized plant:', normalized);

      setPlant(normalized);
    } catch (err) {
      console.error('❌ Error fetching plant details:', err);
      setError('Failed to load plant details');
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
        trefle_id: plant.id,
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

  const getLightLabel = (level) => {
    const labels = {
      0: 'Full Shade',
      1: 'Partial Shade',
      2: 'Partial Sun',
      3: 'Full Sun',
    };
    return labels[level] || 'Unknown';
  };

  const getHumidityLabel = (level) => {
    const labels = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
      5: 'Extremely High',
    };
    return labels[level] || 'Unknown';
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
          {/* IMAGE SECTION */}
          <div className="md:w-1/2">
            {plant.image_url && typeof plant.image_url === 'string' ? (
              <img
                src={plant.image_url}
                alt={plant.common_name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl">🌱</span>
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {String(plant.common_name)}
            </h1>

            {plant.scientific_name &&
              typeof plant.scientific_name === 'string' && (
                <p className="text-xl text-gray-500 italic mb-4">
                  {String(plant.scientific_name)}
                </p>
              )}

            <div className="space-y-4 mb-6">
              {/* Family */}
              {plant.family && typeof plant.family === 'string' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    🌿 Family
                  </h3>
                  <p className="text-gray-600">{String(plant.family)}</p>
                </div>
              )}

              {/* Genus */}
              {plant.genus && typeof plant.genus === 'string' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">🔬 Genus</h3>
                  <p className="text-gray-600">{String(plant.genus)}</p>
                </div>
              )}

              {/* Light Requirements */}
              {typeof plant.light === 'number' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">☀️ Light</h3>
                  <p className="text-gray-600">{getLightLabel(plant.light)}</p>
                </div>
              )}

              {/* Soil Humidity */}
              {typeof plant.soil_humidity === 'number' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    💧 Soil Moisture
                  </h3>
                  <p className="text-gray-600">
                    {getHumidityLabel(plant.soil_humidity)}
                  </p>
                </div>
              )}

              {/* Atmospheric Humidity */}
              {typeof plant.atmospheric_humidity === 'number' && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    💨 Air Humidity
                  </h3>
                  <p className="text-gray-600">
                    {getHumidityLabel(plant.atmospheric_humidity)}
                  </p>
                </div>
              )}

              {/* Temperature */}
              {typeof plant.temperature_min === 'number' &&
                typeof plant.temperature_max === 'number' && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">
                      🌡️ Temperature
                    </h3>
                    <p className="text-gray-600">
                      {plant.temperature_min}°C - {plant.temperature_max}°C
                    </p>
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
