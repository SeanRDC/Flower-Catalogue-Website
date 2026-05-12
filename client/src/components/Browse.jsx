import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/Browse.css';

const MOCK_FLOWERS = [
  {
    _id: "1",
    commonName: "Pink Peony",
    family: "Paeoniaceae",
    description: "Lush, full-bodied, and incredibly fragrant. Peonies are a seasonal favorite representing romance and prosperity.",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "2",
    commonName: "Red Rose",
    family: "Rosaceae",
    description: "A classic symbol of love, known for its deep velvet petals and beautiful, timeless fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "3",
    commonName: "Yellow Sunflower",
    family: "Asteraceae",
    description: "Bright, cheerful, and iconic. Sunflowers turn their heads to follow the sun across the summer sky.",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "4",
    commonName: "White Tulip",
    family: "Liliaceae",
    description: "Elegant and simple, the white tulip represents purity, forgiveness, and the arrival of spring.",
    imageUrl: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "5",
    commonName: "Blue Hydrangea",
    family: "Hydrangeaceae",
    description: "Known for their massive, lush blooms. The striking blue color is actually determined by the soil's acidity.",
    imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "6",
    commonName: "Purple Orchid",
    family: "Orchidaceae",
    description: "Exotic, graceful, and delicate. Orchids make a stunning, long-lasting statement in any room.",
    imageUrl: "https://images.unsplash.com/photo-1528659914406-81622381f9b3?auto=format&fit=crop&w=800&q=80"
  }
];

const Browse = () => {
  const [allFlowers, setAllFlowers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [isMobileSubNavExpanded, setIsMobileSubNavExpanded] = useState(false);

  const browseRef = useRef(null);
  const topPicksRef = useRef(null);
  const petalsRef = useRef(null);
  const subNavRef = useRef(null); 
  
  const location = useLocation();
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCurrentSearchQuery(searchParams.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    document.title = 'Browse | Peony';

    if (currentSearchQuery) {
      const query = currentSearchQuery.toLowerCase();
      const filteredResults = MOCK_FLOWERS.filter((flower) => 
        flower.commonName.toLowerCase().includes(query) || 
        flower.family.toLowerCase().includes(query)
      );
      setAllFlowers(filteredResults);
    } else {
      setAllFlowers(MOCK_FLOWERS);
    }
  }, [currentSearchQuery]);

  /* useEffect(() => {
    document.title = 'Browse | Peony';

    const endpoint = currentSearchQuery 
      ? `http://localhost:5000/api/flowers?search=${currentSearchQuery}&page=1&limit=30`
      : `http://localhost:5000/api/flowers?page=1&limit=30`;

    axios
      .get(endpoint)
      .then((res) => {
        if (res.data?.flowers?.length) {
          setAllFlowers(res.data.flowers);
        } else {
          setAllFlowers([]);
        }
      })
      .catch((err) => console.error(err));
      
  }, [currentSearchQuery]);
  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subNavRef.current && !subNavRef.current.contains(event.target)) {
        setIsMobileSubNavExpanded(false);
      }
    };
    
    if (isMobileSubNavExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileSubNavExpanded]);

  const scrollTo = (ref, tab) => {
    setActiveTab(tab);
    setIsMobileSubNavExpanded(false);
    
    setTimeout(() => {
      const yOffset = -120; 
      const element = ref.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const uniqueFamilies = Array.from(new Set(allFlowers.map(f => f.family))).filter(Boolean).slice(0, 3);
  const dynamicCategories = uniqueFamilies.map(family => {
    const representativeFlower = allFlowers.find(f => f.family === family);
    return {
      id: family,
      name: family ? family.replace('ceae', '') : '',
      imageUrl: representativeFlower?.imageUrl
    };
  });

  const topPicks = allFlowers.slice(0, 8);
  const visiblePicks = showAll ? allFlowers : topPicks;
  
  const petalsImages = allFlowers.length > 8 
    ? allFlowers.slice(8, 17) 
    : [...allFlowers, ...allFlowers, ...allFlowers].slice(0, 9);

  return (
      <div className="desktop-home-page">
        <div className={`browse-hero-header ${isMobileSubNavExpanded ? 'expanded' : ''}`}>
          <div className="vector-container">
            <img 
              className="vector" 
              src="https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80" 
              alt="Header background" 
            />
            <svg className="wave-svg-clip">
              <defs>
                <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                  <path d="M 0,0 L 0,0.75 Q 0.125,0.85 0.25,0.75 Q 0.375,0.65 0.5,0.75 Q 0.625,0.85 0.75,0.75 Q 0.875,0.65 1,0.75 L 1,0 Z" />
                </clipPath>
              </defs>
            </svg>
          </div>
          
          <div className="sub-nav-bar desktop-only">
            <a onClick={() => scrollTo(browseRef, 'browse')} className={activeTab === 'browse' ? 'active' : ''}>Browse</a>
            <a onClick={() => scrollTo(topPicksRef, 'toppicks')} className={activeTab === 'toppicks' ? 'active' : ''}>Top picks</a>
            <a onClick={() => scrollTo(petalsRef, 'petals')} className={activeTab === 'petals' ? 'active' : ''}>Petals</a>
          </div>

          <div 
            ref={subNavRef} 
            className={`sub-nav-bar mobile-only ${isMobileSubNavExpanded ? 'expanded' : ''}`}
          >
            {isMobileSubNavExpanded ? (
              <div className="mobile-nav-links">
                <a onClick={() => scrollTo(browseRef, 'browse')} className={activeTab === 'browse' ? 'active' : ''}>Browse</a>
                <div className="nav-divider"></div>
                <a onClick={() => scrollTo(topPicksRef, 'toppicks')} className={activeTab === 'toppicks' ? 'active' : ''}>Top pick</a>
                <div className="nav-divider"></div>
                <a onClick={() => scrollTo(petalsRef, 'petals')} className={activeTab === 'petals' ? 'active' : ''}>Petals</a>
                
                <div className="collapse-icon" onClick={() => setIsMobileSubNavExpanded(false)}>
                  <ChevronUp size={24} color="white" />
                </div>
              </div>
            ) : (
              <div className="mobile-nav-links collapsed-view" onClick={() => setIsMobileSubNavExpanded(true)}>
                <span className="active-tab-text">
                  {activeTab === 'browse' ? 'Browse' : activeTab === 'toppicks' ? 'Top pick' : 'Petals'}
                </span>
                <ChevronDown size={20} color="white" />
              </div>
            )}
          </div>
        </div>

        <section className="categories" id="browse" ref={browseRef}>
          <div className="group-2">
            <div className="header-1">
              {currentSearchQuery ? `Search Results for "${currentSearchQuery}"` : "Browse Unlimited Flowers"}
            </div>
            <div className="sub-header-1">
              {currentSearchQuery ? `Showing matching flowers` : "Browse Flowers by Category"}
            </div>
          </div>
          
          {allFlowers.length === 0 ? (
            <div style={{textAlign: "center", padding: "50px 0"}}>
               <h2>No flowers found! Try searching for something else.</h2>
            </div>
          ) : currentSearchQuery ? (
            <div className="frame">
              {allFlowers.map((flower) => (
                <div key={flower._id} className="top-pick">
                  <img className="images" src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
                  <div className="description">
                    <div className="product-name-item">{flower.commonName}</div>
                    <p className="sort-description">
                      {flower.description?.length > 80 
                        ? `${flower.description.substring(0, 80)}...` 
                        : flower.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {dynamicCategories.map((cat) => (
                <div key={cat.id || Math.random()} className="category-item">
                  <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
                  <p className="category-text">{cat.name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {!currentSearchQuery && (
          <>
            <section className="top-picks" id="top-picks" ref={topPicksRef}>
              <h2 className="title">Top Picks</h2>
              
              <div className="frame">
                {visiblePicks.map((flower) => (
                  <div key={flower._id} className="top-pick">
                    <img className="images" src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
                    <div className="description">
                      <div className="product-name-item">{flower.commonName}</div>
                      <p className="sort-description">
                        {flower.description?.length > 80 
                          ? `${flower.description.substring(0, 80)}...` 
                          : flower.description}
                      </p>
                    </div>
                  </div>
                ))}
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
      </div>
  );
};

export default Browse;