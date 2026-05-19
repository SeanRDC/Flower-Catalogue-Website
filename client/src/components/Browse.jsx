import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Maximize2, Image as ImageIcon, Star, Download, X } from 'lucide-react';
import '../styles/Browse.css';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const location = useLocation(); // Define location once at the top
  
  // URL State
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');
  const currentSearchQuery = searchParams.get('search') || '';
  
  // React State
  const [allFlowers, setAllFlowers] = useState([]);
  
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [isMobileSubNavExpanded, setIsMobileSubNavExpanded] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
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

  // Fetch Live Data from Render
  useEffect(() => {
    document.title = selectedCategory ? `${selectedCategory}s | Peony` : 'Browse | Peony';

    const endpoint = `https://flower-catalogue-website.onrender.com/api/flowers?page=1&limit=250`;

    axios
      .get(endpoint)
      .then((res) => {
        if (res.data?.flowers?.length) {
          setAllFlowers(res.data.flowers);
        } else {
          setAllFlowers([]);
        }
      })
      .catch((err) => console.error('Error fetching flowers:', err));
      
  }, []);

  // Handle clicking outside mobile subnav to close it
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

  // Asset handlers
  const handleDownload = (e, url, name) => {
    e.stopPropagation();
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${name.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => console.error('Error downloading image:', err));
  };

  const handleSaveToAssets = async (e, flowerId, type) => {
    e.stopPropagation(); 
    
    if (!currentUser) {
      openModal('login');
      return;
    }

    try {
      const endpoint = type === 'favorite' ? '/api/favorites' : '/api/collections';
      
      await axios.post(`https://flower-catalogue-website.onrender.com${endpoint}`, {
        email: currentUser.email, 
        flowerId: flowerId        
      });
      
      alert(`Successfully added to your ${type}s!`);
    } catch (err) {
      console.error(`Failed to save ${type}:`, err);
      alert('Something went wrong saving your flower.');
    }
  };

  // Card UI Component
  const renderFlowerCard = (flower) => {
    const isExpanded = expandedId === flower._id;

    return (
      <div 
        key={flower._id} 
        className={`top-pick ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setExpandedId(isExpanded ? null : flower._id)}
      >
        <div className="image-wrapper">
          <img className="images" src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
          {isExpanded && (
            <button 
              className="expand-fullscreen-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(flower.imageUrl);
              }}
              title="View Fullscreen"
            >
              <Maximize2 size={18} color="#666" />
            </button>
          )}
        </div>

        <div className="card-content-wrapper">
          {isExpanded && (
            <div className="action-bar">
              <button className="action-icon-btn" title="Add to collections" 
                onClick={(e) => handleSaveToAssets(e, flower._id, 'collection')}>
                <ImageIcon size={20} />
              </button>

              <button className="action-icon-btn" title="Add to favorites" 
                onClick={(e) => handleSaveToAssets(e, flower._id, 'favorite')}>
                <Star size={20} />
              </button>
              
              <button className="action-icon-btn" title="Download image" onClick={(e) => handleDownload(e, flower.imageUrl, flower.commonName)}>
                <Download size={20} />
              </button>
            </div>
          )}

          <div className="description">
            <div className="product-name-item">{flower.commonName}</div>
            <p className="sort-description">
              {isExpanded 
                ? flower.description 
                : (flower.description?.length > 80 ? `${flower.description.substring(0, 80)}...` : flower.description)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Slicing data for secondary sections
  const topPicks = allFlowers.slice(0, 8);
  const visiblePicks = showAll ? allFlowers : topPicks;
  
  const petalsImages = allFlowers.length > 8 
    ? allFlowers.slice(8, 17) 
    : [...allFlowers, ...allFlowers, ...allFlowers].slice(0, 9);

  return (
    <div className="desktop-home-page">
      <div className={`browse-hero-header ${isMobileSubNavExpanded ? 'expanded' : ''}`}>
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

        {!currentSearchQuery && (
          <>
            {/* DYNAMIC SUB-NAV BAR (Desktop) */}
            <div className="sub-nav-bar desktop-only">
              {!selectedCategory ? (
                <>
                  <a onClick={() => scrollTo(browseRef, 'browse')} className={activeTab === 'browse' ? 'active' : ''}>Browse</a>
                  <a onClick={() => scrollTo(topPicksRef, 'toppicks')} className={activeTab === 'toppicks' ? 'active' : ''}>Top picks</a>
                  <a onClick={() => scrollTo(petalsRef, 'petals')} className={activeTab === 'petals' ? 'active' : ''}>Petals</a>
                </>
              ) : (
                <>
                  <a onClick={() => handleCategorySelect(null)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>← All Categories</a>
                  <a onClick={() => handleCategorySelect('Annual')} className={selectedCategory === 'Annual' ? 'active' : ''}>Annual</a>
                  <a onClick={() => handleCategorySelect('Biennial')} className={selectedCategory === 'Biennial' ? 'active' : ''}>Biennial</a>
                  <a onClick={() => handleCategorySelect('Perennial')} className={selectedCategory === 'Perennial' ? 'active' : ''}>Perennial</a>
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
                      <a onClick={() => scrollTo(topPicksRef, 'toppicks')}>Top pick</a>
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
                    {selectedCategory || (activeTab === 'browse' ? 'Browse' : activeTab === 'toppicks' ? 'Top pick' : 'Petals')}
                  </span>
                  <ChevronDown size={20} color="white" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <section className="categories" id="browse" ref={browseRef}>
        {/* CASE 1: Category Selected - Show Description + Filtered Grid */}
        {selectedCategory ? (
          <div className="category-detail-view">
            <div className="group-2">
              <div className="header-1">{LIFECYCLE_CATEGORIES[selectedCategory].title}</div>
              <div className="sub-header-1" style={{ maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
                {LIFECYCLE_CATEGORIES[selectedCategory].description}
              </div>
            </div>
            
            <div className="frame" style={{ marginTop: '40px' }}>
              {displayedFlowers.length > 0 ? (
                displayedFlowers.map(renderFlowerCard)
              ) : (
                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px' }}>
                  <p>No {selectedCategory.toLowerCase()} flowers found in the database.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* CASE 2: No Category Selected - Show Standard Header + (Search Results OR Category Grid) */
          <>
            <div className="group-2">
              <div className="header-1">
                {currentSearchQuery ? `Search Results for "${currentSearchQuery}"` : "Browse Unlimited Flowers"}
              </div>
              <div className="sub-header-1">
                {currentSearchQuery ? `Showing matching flowers` : "Browse Flowers by Lifecycle"}
              </div>
            </div>

            {allFlowers.length === 0 ? (
              <div className="loading-state">
                <h2>Loading database...</h2>
              </div>
            ) : currentSearchQuery ? (
              <div className="frame">
                {displayedFlowers.length > 0 ? (
                  displayedFlowers.map(renderFlowerCard)
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
                    <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
                    <p className="category-text">{cat.name}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {!selectedCategory && !currentSearchQuery && (
        <>
          <section className="top-picks" id="top-picks" ref={topPicksRef}>
            <h2 className="title">Top Picks</h2>
            <div className="frame">
              {visiblePicks.map(renderFlowerCard)}
            </div>
            <button className="show-more" onClick={() => setShowAll((prev) => !prev)}>
              <span className="text-wrapper-11">{showAll ? 'Show less' : 'Show more'}</span>
            </button>
          </section>

          <section className="share" id="petals" ref={petalsRef}>
            <div className="title-2">
              <div className="title-3">Diverse flowers for everyone</div>
              <div className="title-4">#Petals</div>
            </div>
            <div className="images-2">
              {petalsImages.map((flower, index) => (
                <img key={`${flower._id}-${index}`} src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
              ))}
            </div>
          </section>
        </>
      )}

      {/* FULLSCREEN IMAGE MODAL */}
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

export default Browse;