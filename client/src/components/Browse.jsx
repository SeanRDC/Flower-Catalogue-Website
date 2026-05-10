import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Browse.css';

const Browse = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Browse | Peony";
    
    const fetchFlowers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/flowers');
        
        console.log("WHAT DID THE SERVER SEND?", response.data); 
        
        setFlowers(response.data.flowers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flowers:", err);
        setError("Failed to load flowers. Make sure your server is running!");
        setLoading(false);
      }
    };

    fetchFlowers();
  }, []);

  if (loading) return <div className="status-message">Loading beautiful blooms...</div>;
  if (error) return <div className="status-message error">{error}</div>;
  
  if (flowers.length === 0) return <div className="status-message">No flowers found. Check the console log to see if the array is empty!</div>;

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Our Collection</h1>
        <p>Discover the perfect flower for your next arrangement.</p>
      </div>
      
      <div className="flower-grid">
        {flowers.map((flower) => (
          <div key={flower._id} className="flower-card">
            <div className="flower-image-container">
              <img src={flower.imageUrl || '/heroimage.jpg'} alt={flower.commonName} className="flower-image" />
            </div>
            <div className="flower-info">
              <span className="flower-category">{flower.family}</span>
              <h3>{flower.commonName}</h3>
              <p className="flower-scientific">{flower.scientificName}</p>
              <p className="flower-description">
                {flower.description?.length > 80 
                  ? `${flower.description.substring(0, 80)}...` 
                  : flower.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;