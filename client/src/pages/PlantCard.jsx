import '../styles/PlantCard.css';

const PlantCard = ({ plant }) => {
  const {
    common_name,
    scientific_name,
    default_image,
    watering,
    sunlight,
    cycle,
  } = plant;

  return (
    <div className="plant-card">
      <div className="plant-image-container">
        {default_image?.regular_url ? (
          <img
            src={default_image.regular_url}
            alt={common_name}
            className="plant-image"
          />
        ) : (
          <div className="plant-image-placeholder">
            <span>🌱</span>
          </div>
        )}
      </div>

      <div className="plant-card-content">
        <h3 className="plant-name">{common_name || 'Unknown Plant'}</h3>

        {scientific_name && scientific_name.length > 0 && (
          <p className="plant-scientific-name">{scientific_name[0]}</p>
        )}

        <div className="plant-details">
          {watering && (
            <div className="plant-detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-text">{watering}</span>
            </div>
          )}

          {sunlight && sunlight.length > 0 && (
            <div className="plant-detail-item">
              <span className="detail-icon">☀️</span>
              <span className="detail-text">{sunlight[0]}</span>
            </div>
          )}

          {cycle && (
            <div className="plant-detail-item">
              <span className="detail-icon">🔄</span>
              <span className="detail-text">{cycle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
