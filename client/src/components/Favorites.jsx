import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Favorites.css';

const MOCK_FAVORITES = [
  { _id: "f1", commonName: "Purple Orchid", description: "Exotic and graceful statement bloom.", imageUrl: "https://images.unsplash.com/photo-1528659914406-81622381f9b3?auto=format&fit=crop&w=800&q=80" }
];

const Favorites = () => {
  const [items, setItems] = useState(MOCK_FAVORITES);

  useEffect(() => {
    document.title = 'Favorites | Peony';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="desktop-home-page asset-page asset-page">
      <div className="subpage-hero-header">
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
        
        <div className="asset-sub-nav">
          <Link to="/favorites" className="active">Favorites</Link>
          <Link to="/collections">Collections</Link>
        </div>
      </div>

      <section className="favorite-section">
        <h2 className="title">My Favorites</h2>
        <div className="frame">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="top-pick">
                <img className="images" src={item.imageUrl} alt={item.commonName} />
                <div className="description">
                  <div className="product-name-item">{item.commonName}</div>
                  <p className="sort-description">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">You haven't added any favorites yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;