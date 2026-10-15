import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/useAuth';
import { Maximize2, Trash2 } from 'lucide-react';
import { headerImageProps } from '../utils/image';
import ProgressiveImage from './ProgressiveImage';
import FullscreenImage from './FullscreenImage';
import '../styles/Browse.css';
import '../styles/Favorites.css';

// Shared page for a user's Favorites and Collections; `config` supplies the
// endpoints, how to pick the flowers out of the user record, and the copy.
const SavedFlowers = ({ config }) => {
  const { currentUser, openModal } = useAuth();
  const [items, setItems] = useState([]);
  const [loadedFor, setLoadedFor] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const location = useLocation();
  const currentSearchQuery = new URLSearchParams(location.search).get('search') || '';
  const loading = Boolean(currentUser) && loadedFor !== currentUser.email;

  useEffect(() => {
    document.title = `${config.title} | Peony`;
    window.scrollTo(0, 0);
  }, [config.title]);

  useEffect(() => {
    if (!currentUser) return;
    const controller = new AbortController();

    apiClient.get('/user/me', { signal: controller.signal })
      .then((res) => {
        setItems(config.pickFlowers(res.data));
        setLoadError('');
        setLoadedFor(currentUser.email);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error(err);
        setLoadError('We could not load your saved flowers. Please try again later.');
        setLoadedFor(currentUser.email);
      });

    return () => controller.abort();
  }, [currentUser, config]);

  const handleRemoveItem = async (e, flowerId) => {
    e.stopPropagation();
    try {
      await apiClient.post(config.removeEndpoint, { flowerId });
      setItems((prev) => prev.filter((item) => item._id !== flowerId));
      setExpandedId(null);
    } catch (err) {
      console.error(`Failed to remove from ${config.noun}`, err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm(config.clearConfirm)) return;

    try {
      await apiClient.post(config.clearEndpoint);
      setItems([]);
    } catch (err) {
      console.error(`Failed to clear ${config.noun}`, err);
    }
  };

  const query = currentSearchQuery.toLowerCase();
  const filteredItems = items.filter((item) =>
    item.commonName?.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query)
  );

  return (
    <motion.div className="desktop-home-page asset-page">
      <div className="browse-hero-header">
        <div className="vector-container">
          <img className="vector" {...headerImageProps} />
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
            {currentSearchQuery ? `Search Results in ${config.title} for "${currentSearchQuery}"` : `My ${config.title}`}
          </h2>
          {currentUser && items.length > 0 && !currentSearchQuery && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear {config.title}
            </button>
          )}
        </div>

        {!currentUser ? (
          <div className="empty-msg">
            <p>Please log in to view your saved {config.noun}.</p>
            <button onClick={() => openModal('login')} style={{padding: '10px 30px', background: '#5a6c3a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'}}>
              Log In
            </button>
          </div>
        ) : loading ? (
          <p className="empty-msg">Loading your garden...</p>
        ) : loadError ? (
          <p className="empty-msg">{loadError}</p>
        ) : (
          <div className="frame">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isExpanded = expandedId === item._id;
                return (
                  <div key={item._id} className={`top-pick ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpandedId(isExpanded ? null : item._id)}>
                    <div className="image-wrapper">
                      <ProgressiveImage className="images" src={item.imageUrl} alt={item.commonName} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                      {isExpanded && (
                        <button className="expand-fullscreen-btn" onClick={(e) => { e.stopPropagation(); setFullscreenImage(item); }} title="View Fullscreen" aria-label="View fullscreen">
                          <Maximize2 size={18} color="#666" />
                        </button>
                      )}
                    </div>
                    <div className="card-content-wrapper">
                      {isExpanded && (
                        <div className="action-bar">
                          <button className="action-icon-btn delete-btn" title={`Remove from ${config.noun}`} aria-label={`Remove from ${config.noun}`} onClick={(e) => handleRemoveItem(e, item._id)}>
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
                {currentSearchQuery ? config.noMatches : config.empty}
              </p>
            )}
          </div>
        )}
      </section>

      {fullscreenImage && (
        <FullscreenImage
          src={fullscreenImage.imageUrl}
          alt={fullscreenImage.commonName}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </motion.div>
  );
};

export default SavedFlowers;
