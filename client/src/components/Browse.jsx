import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Browse.css';
import heroImage from '../assets/heroimage.jpg'; 

const Browse = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = "Browse | Peony";
    
    const fetchFlowers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/flowers?page=${currentPage}&limit=20`);
        
        setFlowers(response.data.flowers);
        setTotalPages(response.data.totalPages);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Error fetching flowers:", err);
        setError("Failed to load flowers. Make sure your server is running!");
        setLoading(false);
      }
    };

    fetchFlowers();
  }, [currentPage]);
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (error) return <div className="status-message error">{error}</div>;

  return (
    <div className="desktop-browse-page">
      <div className="browse-container">
        <div className="group-2">
          <div className="header-1">Browse Unlimited Flowers</div>
          <div className="sub-header-1">Browse Flowers by Collection</div>
        </div>
        
        {loading ? (
          <div className="status-message">Loading beautiful blooms...</div>
        ) : (
          <>
            <div className="flower-grid">
              {flowers.map((flower) => (
                <div key={flower._id} className="top-pick">
                  <div className="flower-image-container">
                    <img 
                      src={flower.imageUrl === '/heroimage.jpg' ? heroImage : flower.imageUrl} 
                      alt={flower.commonName} 
                      className="images" 
                      onError={(e) => {
                        if (!e.target.src.includes('heroimage')) e.target.src = heroImage;
                      }}
                    />
                  </div>
                  <div className="description">
                    <div className="product-name">{flower.commonName}</div>
                    <p className="scientific-name">{flower.scientificName}</p>
                    <p className="sort-description">
                      {flower.description?.length > 80 
                        ? `${flower.description.substring(0, 80)}...` 
                        : flower.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className="show-more-btn"
                >
                  &#8592; Previous
                </button>
                
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  className="show-more-btn"
                >
                  Next &#8594;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;