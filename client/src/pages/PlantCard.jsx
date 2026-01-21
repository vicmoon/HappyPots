import { Link } from 'react-router-dom';
import '../styles/PlantCard.css';

const PlantCard = ({ plant }) => {
  // ⭐ STRICT validation - only render if all required fields are primitives
  if (!plant || typeof plant !== 'object') {
    console.error('❌ PlantCard: plant is not an object', plant);
    return null;
  }

  const { id, common_name } = plant;

  // ⭐ If these aren't primitives, skip rendering
  if (typeof id !== 'number' || typeof common_name !== 'string') {
    console.error('❌ PlantCard: id or common_name is not a primitive', {
      id,
      common_name,
    });
    return null;
  }

  const {
    scientific_name,
    image_url,
    family,
    light,
    soil_humidity,
    atmospheric_humidity,
  } = plant;

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

  return (
    <Link to={`/plants/${id}`} className="plant-card">
      <div className="plant-image-container">
        {image_url && typeof image_url === 'string' ? (
          <img
            src={image_url}
            alt={common_name}
            className="plant-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="plant-image-placeholder">
            <span>🌱</span>
          </div>
        )}
      </div>

      <div className="plant-card-content">
        <h3 className="plant-name">{common_name}</h3>

        {scientific_name && typeof scientific_name === 'string' && (
          <p className="plant-scientific-name">{scientific_name}</p>
        )}

        {family && typeof family === 'string' && (
          <p className="plant-family">{family}</p>
        )}

        <div className="plant-details">
          {typeof light === 'number' && (
            <div className="plant-detail-item">
              <span className="detail-icon">☀️</span>
              <span className="detail-text">{getLightLabel(light)}</span>
            </div>
          )}

          {typeof soil_humidity === 'number' && (
            <div className="plant-detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-text">
                Soil: {getHumidityLabel(soil_humidity)}
              </span>
            </div>
          )}

          {typeof atmospheric_humidity === 'number' && (
            <div className="plant-detail-item">
              <span className="detail-icon">💨</span>
              <span className="detail-text">
                Air: {getHumidityLabel(atmospheric_humidity)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlantCard;
