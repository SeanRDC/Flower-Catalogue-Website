import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Browse.css';
import '../styles/Favorites.css';

const MOCK_COLLECTIONS = [
  { _id: "c1", commonName: "Spring Bouquet", description: "A curated mix of seasonal tulips and peonies.", imageUrl: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80" },
  { _id: "c2", commonName: "Desert Roses", description: "Hardy succulents and unique cacti blooms.", imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80" }
];

const Collections = () => {
  const [items, setItems] = useState(MOCK_COLLECTIONS);
  const location = useLocation();
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCurrentSearchQuery(searchParams.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    document.title = 'Collections | Peony';
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = items.filter(item => 
    item.commonName.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(currentSearchQuery.toLowerCase())
  );

  return (
    <div className="desktop-home-page">
      <div className="browse-hero-header">
        <div className="vector-container">
          <img className="vector" src="https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80" alt="Header background" />
          <svg className="wave-svg-clip">
            <defs>
              <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 L 0,0.75 Q 0.125,0.85 0.25,0.75 Q 0.375,0.65 0.5,0.75 Q 0.625,0.85 0.75,0.75 Q 0.875,0.65 1,0.75 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="sub-nav-bar">
          <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favorites</Link>
          <Link to="/collections" className={location.pathname === '/collections' ? 'active' : ''}>Collections</Link>
        </div>
      </div>

      <section className="favorite-section">
        <h2 className="title">
          {currentSearchQuery ? `Search Results in Collections for "${currentSearchQuery}"` : "My Collections"}
        </h2>
        <div className="frame">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="top-pick">
                <img className="images" src={item.imageUrl} alt={item.commonName} />
                <div className="description">
                  <div className="product-name-item">{item.commonName}</div>
                  <p className="sort-description">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">
              {currentSearchQuery ? "No matching collections found." : "You haven't created any collections yet."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;