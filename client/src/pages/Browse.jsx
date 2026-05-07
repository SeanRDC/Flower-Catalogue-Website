import { useState, useEffect } from 'react';
import FlowerCard from '../components/FlowerCard';
import '../styles/Browse.css';

const Browse = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/flowers?page=1&limit=50')
      .then(res => res.json())
      .then(data => {
        setFlowers(data.flowers);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading blooms...</div>;

  return (
    <div className="browse-container">
      <h2 className="browse-title">Explore Our Collection</h2>
      <div className="flower-grid">
        {flowers.map(flower => (
          <FlowerCard key={flower._id} flower={flower} />
        ))}
      </div>
    </div>
  );
};

export default Browse;