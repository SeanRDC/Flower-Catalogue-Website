/* ==========================================================================
   Browse.jsx
   ========================================================================== */

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/Browse.css';

const Browse = () => {
  const [allFlowers, setAllFlowers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [isMobileSubNavExpanded, setIsMobileSubNavExpanded] = useState(false);

  const browseRef = useRef(null);
  const topPicksRef = useRef(null);
  const petalsRef = useRef(null);
  const subNavRef = useRef(null); // NEW: Reference for the mobile sub-nav

  useEffect(() => {
    document.title = 'Browse | Peony';

    axios
      .get('http://localhost:5000/api/flowers?page=1&limit=30')
      .then((res) => {
        if (res.data?.flowers?.length) {
          setAllFlowers(res.data.flowers);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // NEW: Closes the sub-navbar when clicking anywhere outside of it
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
      name: family.replace('ceae', ''),
      imageUrl: representativeFlower.imageUrl
    };
  });

  const topPicks = allFlowers.slice(0, 8);
  const visiblePicks = showAll ? allFlowers : topPicks;
  const petalsImages = allFlowers.slice(8, 17);

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
        
        {/* Desktop Sub Nav */}
        <div className="sub-nav-bar desktop-only">
          <a onClick={() => scrollTo(browseRef, 'browse')} className={activeTab === 'browse' ? 'active' : ''}>Browse</a>
          <a onClick={() => scrollTo(topPicksRef, 'toppicks')} className={activeTab === 'toppicks' ? 'active' : ''}>Top picks</a>
          <a onClick={() => scrollTo(petalsRef, 'petals')} className={activeTab === 'petals' ? 'active' : ''}>Petals</a>
        </div>

        {/* Mobile Collapsible Sub Nav */}
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
          <div className="header-1">Browse Unlimited Flowers</div>
          <div className="sub-header-1">Browse Flowers by Category</div>
        </div>
        
        <div className="category-grid">
          {dynamicCategories.map((cat) => (
            <div key={cat.id} className="category-item">
              <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
              <p className="category-text">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

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
          {petalsImages.map((flower) => (
            <img key={flower._id} src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Browse;