import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Maximize2, Trash2, X } from 'lucide-react'; 
import '../styles/Browse.css';
import '../styles/Favorites.css';

const Collections = () => {
  const { currentUser, openModal } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const location = useLocation();
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCurrentSearchQuery(searchParams.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    document.title = 'Collections | Peony';
    window.scrollTo(0, 0);

    if (currentUser) {
      axios.get(`http://localhost:5000/api/user/${currentUser.email}`)
        .then(res => {
          setItems(res.data.collections[0]?.flowers || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [currentUser]);

  const handleRemoveItem = async (e, flowerId) => {
    e.stopPropagation(); 
    try {
      await axios.post('http://localhost:5000/api/collections/remove', {
        email: currentUser.email,
        flowerId: flowerId
      });
      setItems(items.filter(item => item._id !== flowerId));
      setExpandedId(null); 
    } catch (err) {
      console.error("Failed to remove collection item", err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to empty your entire collection?")) return;
    
    try {
      await axios.post('http://localhost:5000/api/collections/clear', { email: currentUser.email });
      setItems([]); 
    } catch (err) {
      console.error("Failed to clear collections", err);
    }
  };

  const filteredItems = items.filter(item => 
    item.commonName.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(currentSearchQuery.toLowerCase())
  );

  return (
    <div className="desktop-home-page asset-page">
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
        
        <div className="sub-nav-bar desktop-only">
          <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favorites</Link>
          <Link to="/collections" className={location.pathname === '/collections' ? 'active' : ''}>Collections</Link>
        </div>
      </div>

      <section className="favorite-section">
        <div className="section-header">
          <h2 className="title">
            {currentSearchQuery ? `Search Results in Collections for "${currentSearchQuery}"` : "My Collections"}
          </h2>
          {items.length > 0 && !currentSearchQuery && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear Collections
            </button>
          )}
        </div>
        
        {!currentUser ? (
          <div className="empty-msg">
            <p>Please log in to view your saved collections.</p>
            <button onClick={() => openModal('login')} style={{padding: '10px 30px', background: '#5a6c3a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'}}>
              Log In
            </button>
          </div>
        ) : loading ? (
          <p className="empty-msg">Loading your garden...</p>
        ) : (
          <div className="frame">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isExpanded = expandedId === item._id;
                return (
                  <div key={item._id} className={`top-pick ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpandedId(isExpanded ? null : item._id)}>
                    <div className="image-wrapper">
                      <img className="images" src={item.imageUrl} alt={item.commonName} />
                      {isExpanded && (
                        <button className="expand-fullscreen-btn" onClick={(e) => { e.stopPropagation(); setFullscreenImage(item.imageUrl); }} title="View Fullscreen">
                          <Maximize2 size={18} color="#666" />
                        </button>
                      )}
                    </div>
                    <div className="card-content-wrapper">
                      {isExpanded && (
                        <div className="action-bar">
                          <button className="action-icon-btn delete-btn" title="Remove from collections" onClick={(e) => handleRemoveItem(e, item._id)}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                      <div className="description">
                        <div className="product-name-item">{item.commonName}</div>
                        <p className="sort-description">
                          {isExpanded ? item.description : (item.description?.length > 80 ? `${item.description.substring(0, 80)}...` : item.description)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-msg">
                {currentSearchQuery ? "No matching collections found." : "You haven't created any collections yet."}
              </p>
            )}
          </div>
        )}
      </section>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <button className="close-fullscreen-btn" onClick={() => setFullscreenImage(null)}>
            <X size={32} color="white" />
          </button>
          <img src={fullscreenImage} alt="Fullscreen bloom" className="fullscreen-image-view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default Collections;