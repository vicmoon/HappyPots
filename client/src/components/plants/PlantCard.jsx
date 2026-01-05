import { Link } from 'react-router-dom';

const PlantCard = ({ plant }) => {
  return (
    <Link to={`/plants/${plant.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200">
          {plant.default_image?.thumbnail || plant.image_url ? (
            <img
              src={plant.default_image?.thumbnail || plant.image_url}
              alt={plant.common_name}
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
            {plant.common_name}
          </h3>
          {plant.scientific_name && plant.scientific_name[0] && (
            <p className="text-sm text-gray-500 italic mb-2">
              {plant.scientific_name[0]}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {plant.watering && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                💧 {plant.watering}
              </span>
            )}
            {plant.sunlight && plant.sunlight[0] && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                ☀️ {plant.sunlight[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard;
