import { AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Image as ImageIcon, Star, Download } from 'lucide-react';
import '../styles/Browse.css';
import { apiClient } from '../api/client';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { downloadImage } from '../utils/download';
import FilterBar from '../components/FilterBar';
import { headerImageProps } from '../utils/image';
import ProgressiveImage from './ProgressiveImage';
import FullscreenImage from './FullscreenImage';
import FlowerCard from './FlowerCard';

const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const customSmoothScroll = (targetPosition, duration = 600) => {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1); 

    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Catalogue fields the filter bar can narrow by (also the URL parameter names)
const FILTER_KEYS = ['color', 'petalShape', 'type', 'symbolism'];

const LIFECYCLE_CATEGORIES = {
  Annual: {
    id: "Annual",
    name: "Annual",
    title: "Annual Flowers",
    description: "Annual flowers complete their entire lifecycle—from seed to bloom to dying—in a single growing season. They are perfect for adding quick, vibrant, and continuous bursts of color to your garden.",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80" // Sunflower
  },
  Biennial: {
    id: "Biennial",
    name: "Biennial",
    title: "Biennial Flowers",
    description: "Biennials take two years to complete their lifecycle. In the first year, they grow strong foliage, and in the second year, they bloom beautifully, produce seeds, and naturally fade.",
    imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80" // Hydrangea
  },
  Perennial: {
    id: "Perennial",
    name: "Perennial",
    title: "Perennial Flowers",
    description: "Perennials are the gifts that keep on giving. They live for more than two years, returning each spring from their established root systems to bloom beautifully season after season.",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80" // Peony
  }
};

const Browse = () => {
  const { currentUser, openModal } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL State
  const searchParams = new URLSearchParams(location.search);
  // Ignore unknown categories (e.g. a mistyped ?category= link) instead of crashing
  const categoryParam = searchParams.get('category');
  const selectedCategory = LIFECYCLE_CATEGORIES[categoryParam] ? categoryParam : null;
  const currentSearchQuery = searchParams.get('search') || '';
  const isNewsfeedMode = searchParams.get('view') === 'all';
  
  // React State
  const [allFlowers, setAllFlowers] = useState([]);
  const [topPicksLimit, setTopPicksLimit] = useState(8);
  
  const [activeTab, setActiveTab] = useState('browse');
  const [isMobileSubNavExpanded, setIsMobileSubNavExpanded] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [retryCount, setRetryCount] = useState(0);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [facets, setFacets] = useState(null);

  // Filters live in the URL (e.g. ?view=all&color=Red) so they survive a
  // refresh, work with back/forward and can be shared. They only apply to
  // the complete catalogue view.
  const activeFilters = isNewsfeedMode
    ? Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || '']).filter(([, value]) => value))
    : {};

  const handleFiltersUpdated = (nextFilters) => {
    const next = new URLSearchParams(location.search);
    FILTER_KEYS.forEach((key) => (nextFilters[key] ? next.set(key, nextFilters[key]) : next.delete(key)));
    navigate(`/browse?${next.toString()}`, { replace: true });
    setExpandedId(null);
  };
  
  // Refs for smooth scrolling
  const browseRef = useRef(null);
  const topPicksRef = useRef(null);
  const petalsRef = useRef(null);
  const subNavRef = useRef(null); 
  
  // Derived State
  const displayedFlowers = allFlowers.filter(flower => {
    const matchesCategory = selectedCategory 
      ? flower.lifecycle?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      : true;
      
    const matchesSearch = currentSearchQuery
      ? flower.commonName?.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
        flower.description?.toLowerCase().includes(currentSearchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    document.title = selectedCategory ? `${selectedCategory}s | Peony` : 'Browse | Peony';
  }, [selectedCategory]);

  // Fetch Live Data from Render
  const filterParams = new URLSearchParams();
  FILTER_KEYS.forEach((key) => activeFilters[key] && filterParams.set(key, activeFilters[key]));
  const filterQuery = filterParams.toString();
  const queryString = `page=1&limit=250${filterQuery ? `&${filterQuery}` : ''}`;

  // Filter options and counts for the current selection
  useEffect(() => {
    if (!isNewsfeedMode) return;
    const controller = new AbortController();
    apiClient.get(`/flowers/facets?${filterQuery}`, { signal: controller.signal })
      .then((res) => setFacets(res.data.facets))
      .catch((err) => {
        if (!controller.signal.aborted) console.error('Error loading filter options:', err);
      });
    return () => controller.abort();
  }, [isNewsfeedMode, filterQuery]);
  const requestKey = `${queryString}#${retryCount}`;
  const isLoading = loadedQuery !== requestKey;

  useEffect(() => {
    // Cancel the previous request when filters change so a slow, outdated
    // response can't overwrite newer results.
    const controller = new AbortController();

    apiClient
      .get(`/flowers?${queryString}`, { signal: controller.signal })
      .then((res) => {
        setAllFlowers(res.data?.flowers || []);
        setLoadError(false);
        setLoadedQuery(requestKey);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error('Error fetching flowers:', err);
        setLoadError(true);
        setLoadedQuery(requestKey);
      });

    return () => controller.abort();
  }, [queryString, requestKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subNavRef.current && !subNavRef.current.contains(event.target)) {
        setIsMobileSubNavExpanded(false);
      }
    };
    
    if (isMobileSubNavExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSubNavExpanded]);

  // Navigation handlers
  const scrollTo = (ref, tab) => {
    if (isNewsfeedMode) {
      navigate('/browse');
    }
    
    setActiveTab(tab);
    setIsMobileSubNavExpanded(false);

    setTimeout(() => {
      if (ref.current) {
        const yOffset = -120; 
        const element = ref.current;
        const targetY = element.getBoundingClientRect().top + window.scrollY + yOffset;
        customSmoothScroll(targetY, 600);
      }
    }, 50);
  };

  const handleCategorySelect = (categoryId) => {
  if (categoryId) {
    navigate(`/browse?category=${categoryId}`);
  } else {
    navigate(`/browse`);
  }
  scrollTo(browseRef, 'browse');
};

  // Which flowers the signed-in user has already saved, so the card buttons
  // can show their state and act as toggles
  const [savedIds, setSavedIds] = useState({ favorites: new Set(), collections: new Set() });

  useEffect(() => {
    if (!currentUser) return;
    const controller = new AbortController();
    apiClient.get('/user/me', { signal: controller.signal })
      .then((res) => {
        setSavedIds({
          favorites: new Set((res.data.favorites || []).map((f) => f._id)),
          collections: new Set((res.data.collections?.[0]?.flowers || []).map((f) => f._id)),
        });
      })
      .catch((err) => {
        if (!controller.signal.aborted) console.error('Error loading saved flowers:', err);
      });
    return () => controller.abort();
  }, [currentUser]);

  const handleToggleSaved = async (flower, type) => {
    if (!currentUser) {
      openModal('login');
      return;
    }

    const isSaved = savedIds[type].has(flower._id);
    const label = type === 'favorites' ? 'favorites' : 'collection';

    try {
      await apiClient.post(isSaved ? `/${type}/remove` : `/${type}`, { flowerId: flower._id });
      setSavedIds((prev) => {
        const next = new Set(prev[type]);
        if (isSaved) next.delete(flower._id); else next.add(flower._id);
        return { ...prev, [type]: next };
      });
      showToast(isSaved ? `Removed ${flower.commonName} from your ${label}` : `Added ${flower.commonName} to your ${label}`);
    } catch (err) {
      console.error(`Failed to update ${type}:`, err);
      // A 401 already re-opens the login modal via the API client
      if (err.response?.status !== 401) {
        showToast('Something went wrong. Please try again.', 'error');
      }
    }
  };

  const toggleExpanded = (id) => setExpandedId((current) => (current === id ? null : id));

  const renderFlowerCard = (flower, index) => {
    const isFavorite = savedIds.favorites.has(flower._id);
    const inCollection = savedIds.collections.has(flower._id);

    return (
      <FlowerCard
        key={flower._id}
        flower={flower}
        index={index}
        isExpanded={expandedId === flower._id}
        onToggle={() => toggleExpanded(flower._id)}
        onFullscreen={() => setFullscreenImage(flower)}
        actions={[
          { label: isFavorite ? 'Favorited' : 'Favorite', icon: Star, active: isFavorite, onClick: () => handleToggleSaved(flower, 'favorites') },
          { label: inCollection ? 'In collection' : 'Collect', icon: ImageIcon, active: inCollection, onClick: () => handleToggleSaved(flower, 'collections') },
          { label: 'Download', icon: Download, onClick: () => downloadImage(flower.imageUrl, flower.commonName) },
        ]}
      />
    );
  };

  const renderSkeletons = () => (
    <div className="frame">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="skeleton-card"></div>
      ))}
    </div>
  );

  const renderLoadError = () => (
    <div className="no-results-container">
      <h2 className="no-results-title">We couldn't load the flowers</h2>
      <p className="no-results-text">The catalogue server may be waking up. Please try again in a moment.</p>
      <button className="show-more" onClick={() => setRetryCount((c) => c + 1)}>
        <div className="text-wrapper-11">Try again</div>
      </button>
    </div>
  );

  // Slicing data for secondary sections
  const petalsImages = allFlowers.length > 8 
    ? allFlowers.slice(8, 17) 
    : [...allFlowers, ...allFlowers, ...allFlowers].slice(0, 9);

  return (
    <div className="desktop-home-page">
      {!currentSearchQuery && !isNewsfeedMode && (
        <div className={`browse-hero-header ${isMobileSubNavExpanded ? 'expanded' : ''}`}>
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

          {!currentSearchQuery && (
            <>
              {/* DYNAMIC SUB-NAV BAR (Desktop) */}
              <div className="sub-nav-bar desktop-only">
                {!selectedCategory ? (
                  <>
                    <a onClick={() => scrollTo(browseRef, 'browse')} className={activeTab === 'browse' ? 'active' : ''}><span className="bold-safe" data-text="Browse">Browse</span></a>
                    <a onClick={() => scrollTo(topPicksRef, 'toppicks')} className={activeTab === 'toppicks' ? 'active' : ''}><span className="bold-safe" data-text="Top picks">Top picks</span></a>
                    <a onClick={() => scrollTo(petalsRef, 'petals')} className={activeTab === 'petals' ? 'active' : ''}><span className="bold-safe" data-text="Petals">Petals</span></a>
                  </>
                ) : (
                  <>
                    <a onClick={() => handleCategorySelect(null)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>← All Categories</a>
                    <a onClick={() => handleCategorySelect('Annual')} className={selectedCategory === 'Annual' ? 'active' : ''}><span className="bold-safe" data-text="Annual">Annual</span></a>
                    <a onClick={() => handleCategorySelect('Biennial')} className={selectedCategory === 'Biennial' ? 'active' : ''}><span className="bold-safe" data-text="Biennial">Biennial</span></a>
                    <a onClick={() => handleCategorySelect('Perennial')} className={selectedCategory === 'Perennial' ? 'active' : ''}><span className="bold-safe" data-text="Perennial">Perennial</span></a>
                  </>
                )}
              </div>

              {/* DYNAMIC SUB-NAV BAR (Mobile) */}
              <div ref={subNavRef} className={`sub-nav-bar mobile-only ${isMobileSubNavExpanded ? 'expanded' : ''}`}>
                {isMobileSubNavExpanded ? (
                  <div className="mobile-nav-links">
                    {!selectedCategory ? (
                      <>
                        <a onClick={() => scrollTo(browseRef, 'browse')}>Browse</a>
                        <div className="nav-divider"></div>
                        <a onClick={() => scrollTo(topPicksRef, 'toppicks')}>Top picks</a>
                        <div className="nav-divider"></div>
                        <a onClick={() => scrollTo(petalsRef, 'petals')}>Petals</a>
                      </>
                    ) : (
                      <>
                        <a onClick={() => handleCategorySelect(null)}>All Categories</a>
                        <div className="nav-divider"></div>
                        <a onClick={() => handleCategorySelect('Annual')}>Annual</a>
                        <div className="nav-divider"></div>
                        <a onClick={() => handleCategorySelect('Biennial')}>Biennial</a>
                        <div className="nav-divider"></div>
                        <a onClick={() => handleCategorySelect('Perennial')}>Perennial</a>
                      </>
                    )}
                    <div className="collapse-icon" onClick={() => setIsMobileSubNavExpanded(false)}>
                      <ChevronUp size={24} color="white" />
                    </div>
                  </div>
                ) : (
                  <div className="mobile-nav-links collapsed-view" onClick={() => setIsMobileSubNavExpanded(true)}>
                    <span className="active-tab-text">
                      {selectedCategory || (activeTab === 'browse' ? 'Browse' : activeTab === 'toppicks' ? 'Top picks' : 'Petals')}
                    </span>
                    <ChevronDown size={20} color="white" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )} 

      {currentSearchQuery && (
        <div style={{ height: '160px', width: '100%', display: 'block' }}></div>
      )}

      {isNewsfeedMode && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '140px', 
          zIndex: 20,
          filter: 'drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.15))'
        }}>
          <img 
            {...headerImageProps}
            style={{ width: '100%', height: '100%', objectFit: 'cover', clipPath: 'url(#wave-clip)' }} 
          />
          
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 L 0,0.75 Q 0.125,0.85 0.25,0.75 Q 0.375,0.65 0.5,0.75 Q 0.625,0.85 0.75,0.75 Q 0.875,0.65 1,0.75 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      )}

      {isNewsfeedMode && (
        <div className="filter-sticky">
          <FilterBar
            selected={activeFilters}
            facets={facets}
            total={isLoading || loadError ? undefined : displayedFlowers.length}
            onChange={handleFiltersUpdated}
          />
        </div>
      )}

      {!isNewsfeedMode && (
        <section className="categories" id="browse" ref={browseRef}>
          {selectedCategory ? (
            <div className="category-detail-view">
              <div className="group-2">
                <div className="header-1">{LIFECYCLE_CATEGORIES[selectedCategory].title}</div>
                <div className="sub-header-1" style={{ maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
                  {LIFECYCLE_CATEGORIES[selectedCategory].description}
                </div>
              </div>
              
              {isLoading ? (
                <div style={{ marginTop: '40px' }}>{renderSkeletons()}</div>
              ) : loadError ? (
                renderLoadError()
              ) : (
                <div className="frame" style={{ marginTop: '40px' }}>
                  {displayedFlowers.length > 0 ? (
                    displayedFlowers.map((flower, index) => renderFlowerCard(flower, index))
                  ) : (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px' }}>
                      <p>No {selectedCategory.toLowerCase()} flowers found in the database.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* CASE 2: No Category Selected - Show Standard Header + (Search Results OR Category Grid) */
            <>
              {(!currentSearchQuery || displayedFlowers.length > 0) && (
                <div className="group-2">
                  <div className="header-1">
                    {currentSearchQuery ? `Search Results for "${currentSearchQuery}"` : "Browse Unlimited Flowers"}
                  </div>
                  <div className="sub-header-1">
                    {currentSearchQuery ? `Showing matching flowers` : "Browse Flowers by Lifecycle"}
                  </div>
                </div>
              )}

              {currentSearchQuery && isLoading ? (
                renderSkeletons()
              ) : currentSearchQuery && loadError ? (
                renderLoadError()
              ) : currentSearchQuery ? (
                <div className="frame">
                  {displayedFlowers.length > 0 ? (
                    displayedFlowers.map((flower, index) => renderFlowerCard(flower, index))
                  ) : (
                    <div className="no-results-container">
                      <h2 className="no-results-title">No flowers match "{currentSearchQuery}"</h2>
                      <p className="no-results-text">Try searching for a different flower name, color, or lifecycle.</p>
                    </div>
                  )}
                </div>
              ) : (

                /* THE 3 LIFECYCLE CARDS */
                <div className="category-grid">
                  {Object.values(LIFECYCLE_CATEGORIES).map((cat) => (
                    <div 
                      key={cat.id} 
                      className="category-item" 
                      onClick={() => handleCategorySelect(cat.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <ProgressiveImage src={cat.imageUrl} alt={cat.name} sizes="(max-width: 768px) 45vw, 20vw" />
                      <p className="category-text">{cat.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {!selectedCategory && !currentSearchQuery && (
        <>
          <section className="top-picks" id="top-picks" ref={topPicksRef}>
          
          <div className="title" style={{ marginTop: '0px', marginBottom: '40px' }}>
            {isNewsfeedMode ? 'Complete Catalog' : (selectedCategory ? `${selectedCategory} Flowers` : 'Top picks for you')}
          </div>

          {isLoading ? (
            renderSkeletons()
          ) : loadError ? (
            renderLoadError()
          ) : currentSearchQuery ? (
            <div className="frame">
              {displayedFlowers.length > 0 ? displayedFlowers.map((flower, index) => renderFlowerCard(flower, index)) : (
                <div className="no-results-container">
                  <h2 className="no-results-title">No flowers match "{currentSearchQuery}"</h2>
                  <p className="no-results-text">Try searching for a different flower name, color, or lifecycle.</p>
                </div>
              )}
            </div>
          ) : isNewsfeedMode ? (
            <div className="frame">
              {displayedFlowers.length > 0 ? displayedFlowers.map((flower, index) => renderFlowerCard(flower, index)) : (
                <div className="no-results-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                  <h2 className="no-results-title">No flowers match these filters</h2>
                  <button className="show-more" onClick={() => handleFiltersUpdated({})}>
                    <div className="text-wrapper-11">Clear filters</div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="frame">
                {displayedFlowers.slice(0, topPicksLimit).map((flower, index) => renderFlowerCard(flower, index))}
              </div>
              
              {topPicksLimit < 20 && displayedFlowers.length > 8 ? (
                <button className="show-more" onClick={() => setTopPicksLimit(20)}>
                  <div className="text-wrapper-11">Show more</div>
                </button>
              ) : displayedFlowers.length > 20 ? (
                <button className="show-more see-all-btn" onClick={() => {
                  navigate('/browse?view=all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  <div className="text-wrapper-11">See all flowers</div>
                </button>
              ) : null}
            </>
          )}
        </section>

          {!currentSearchQuery && !selectedCategory && !isNewsfeedMode && (
            <section className="share" id="petals" ref={petalsRef}>
              <div className="title-2">
                <div className="title-3">Diverse flowers for everyone</div>
                <div className="title-4">#Petals</div>
              </div>
              
              <div className="petals-marquee-container">
                <div className="petals-track">
                  {[...petalsImages, ...petalsImages].map((flower, index) => (
                    <ProgressiveImage key={`petal-${index}`} src={flower.imageUrl} alt={index < petalsImages.length ? flower.commonName : ""} sizes="340px" srcSetWidths={[240, 360, 480, 680]} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImage
            src={fullscreenImage.imageUrl}
            alt={fullscreenImage.commonName}
            caption={<><strong>{fullscreenImage.commonName}</strong> <em>{fullscreenImage.scientificName}</em></>}
            onClose={() => setFullscreenImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Browse;