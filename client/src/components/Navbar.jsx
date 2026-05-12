import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import axios from 'axios';
import peonyLogo from '../assets/peony-logo.jpg';
import '../styles/Navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const searchContainerRef = useRef(null);

  const isBrowsePage = location.pathname === '/browse';

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const fetchRecommendations = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/flowers?search=${searchQuery}&limit=5`);
          setRecommendations(res.data.flowers || []);
        } catch (err) {
          console.error(err);
        }
      };
      const timeoutId = setTimeout(fetchRecommendations, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setRecommendations([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  const handleRecommendationClick = (flowerName) => {
    setSearchQuery(flowerName);
    navigate(`/browse?search=${encodeURIComponent(flowerName)}`);
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleMobileNav = (hash) => {
    setIsMobileMenuOpen(false);
    if (!isBrowsePage) {
      navigate(`/browse${hash}`);
    } else {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header 
      ref={headerRef} 
      className={`header ${isMobileMenuOpen ? 'mobile-active' : ''} ${isBrowsePage ? 'browse-mode' : ''} ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="header-left">
        <Link to="/" className="logo-link" onClick={() => setIsMobileMenuOpen(false)}>
          <img className="peony-logo-nav" src={peonyLogo} alt="Peony logo" />
        </Link>
        
        <div className="search-container" ref={searchContainerRef}>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Find a Flower..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            <button type="submit" className="search-button">
              <Search size={18} color="#666" />
            </button>
          </form>

          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="search-recommendations">
              {recommendations.length > 0 ? (
                recommendations.map((flower) => (
                  <div 
                    key={flower._id} 
                    className="recommendation-item" 
                    onClick={() => handleRecommendationClick(flower.commonName)}
                  >
                    <img src={flower.imageUrl} alt={flower.commonName} loading="lazy" />
                    <div className="rec-details">
                      <span className="rec-name">{flower.commonName}</span>
                      <span className="rec-family">{flower.family || 'Flower'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="recommendation-no-results">No flowers found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={28} color="#666" /> : <Menu size={28} color="#666" />}
      </button>

      <nav className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item full-width-click">
            <Link className="home-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          </li>
          <li className="nav-item dropdown-trigger full-width-click" onClick={() => toggleDropdown('assets')}>
            <div className="nav-item-content">
              <span>Assets</span>
              <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'assets' ? 'rotate' : ''}`} />
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'assets' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item"><Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>Favorites</Link></li>
                <li className="dropdown-item"><Link to="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link></li>
                <li className="dropdown-item"><Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</Link></li>
              </ul>
            </div>
          </li>
          <li className="nav-item dropdown-trigger full-width-click" onClick={() => toggleDropdown('profile')}>
            <div className="nav-item-content">
              <span>Profile</span>
              <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'profile' ? 'rotate' : ''}`} />
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'profile' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item"><div onClick={() => setIsMobileMenuOpen(false)}>Sign in</div></li>
                <li className="dropdown-item"><div onClick={() => setIsMobileMenuOpen(false)}>Log in</div></li>
                <li className="dropdown-item"><Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Help and Support</Link></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;