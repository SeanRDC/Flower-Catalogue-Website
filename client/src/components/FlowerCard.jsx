const FlowerCard = ({ flower }) => {
  const handleFavorite = () => {
    console.log(`Added ${flower.commonName} to backend favorites`);
  };

  return (
    <div className="flower-card">
      <img src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
      <div className="card-content">
        <h3>{flower.commonName}</h3>
        <p className="scientific">{flower.scientificName}</p>
        <button onClick={handleFavorite} className="action-btn">
          Save to Favorites
        </button>
      </div>
    </div>
  );
};

export default FlowerCard;