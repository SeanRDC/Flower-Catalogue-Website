import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import peonyLogo from '../assets/peony-logo.jpg';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const searchContainerRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const isNewsfeedMode = searchParams.get('view') === 'all';

  const isBrowseMode = (location.pathname === '/browse' && !isNewsfeedMode) || location.pathname === '/favorites' || location.pathname === '/collections';
  const specialPages = ['/feedback', '/survey', '/support', '/terms', '/privacy', '/NotFound'];
  const isSpecialPage = specialPages.includes(location.pathname);
  
  // DYNAMIC PLACEHOLDER LOGIC
  let searchPlaceholder = "Find a Flower...";
  if (location.pathname === '/favorites') {
    searchPlaceholder = "Search your favorites...";
  } else if (location.pathname === '/collections') {
    searchPlaceholder = "Search your collections...";
  } else if (currentCategory) {
    searchPlaceholder = `Search ${currentCategory.toLowerCase()}s...`; 
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await axios.get(`https://flower-catalogue-website.onrender.com/api/flowers?search=${searchQuery}&limit=5`);
        setSuggestions(res.data.flowers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
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

  // Helper
  const closeMobileMenu = () => {
    setIsClosing(true);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null); 
    
    setTimeout(() => {
      setIsClosing(false);
    }, 400);
  };

  // SMART SEARCH SUBMIT LOGIC
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      navigate(currentCategory ? `/browse?category=${currentCategory}` : '/browse');
      setIsSearchFocused(false);
      closeMobileMenu();
      return;
    }

    if (location.pathname === '/favorites') {
      navigate(`/favorites?search=${encodeURIComponent(query)}`);
    } else if (location.pathname === '/collections') {
      navigate(`/collections?search=${encodeURIComponent(query)}`);
    } else {
      const params = new URLSearchParams();
      if (currentCategory) params.set('category', currentCategory);
      params.set('search', query); 
      
      navigate(`/browse?${params.toString()}`);
    }
    
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
      setActiveDropdown(null);
    }
  };

  const { currentUser, openModal } = useAuth();

  return (
    <header 
      ref={headerRef} 
      className={`header ${(isMobileMenuOpen || isClosing) ? 'mobile-active' : ''} ${isBrowseMode ? 'browse-mode' : ''} ${isNewsfeedMode ? 'newsfeed-header' : ''} ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="header-left">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <img className="peony-logo-nav" src={peonyLogo} alt="Peony logo" />
        </Link>
        
        {!isSpecialPage && (
          <div className="search-container" ref={searchContainerRef}>
            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
              />
              <button type="submit" className="search-button">
                <Search size={18} color="#666" />
              </button>
            </form>

            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="search-dropdown">
                {isSearching ? (
                  <div className="search-dropdown-message">Searching database...</div>
                ) : suggestions.length > 0 ? (
                  <ul className="search-dropdown-list">
                    {suggestions.map(flower => (
                      <li 
                        key={flower._id}
                        className="search-dropdown-item"
                        onMouseDown={(e) => {
                          e.preventDefault(); 
                          setSearchQuery(flower.commonName);
                          navigate(`/browse?search=${encodeURIComponent(flower.commonName)}`);
                          setIsSearchFocused(false);
                        }}
                      >
                         <img 
                           src={flower.imageUrl} 
                           alt={flower.commonName} 
                           className="search-dropdown-img" 
                         />
                         <div className="search-dropdown-text">
                           <span className="search-dropdown-title">{flower.commonName}</span>
                           <span className="search-dropdown-subtitle">{flower.lifecycle}</span>
                         </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="search-dropdown-message">No matches found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={28} color="#666" /> : <Menu size={28} color="#666" />}
      </button>

      <nav className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item full-width-click">
            <Link className="home-link" to="/" onClick={closeMobileMenu}>Home</Link>
          </li>
          
          <li className="nav-item dropdown-trigger full-width-click" onClick={() => toggleDropdown('assets')}>
            <div className="nav-item-content">
              <span>Assets</span>
              <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'assets' ? 'rotate' : ''}`} />
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'assets' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item"><Link to="/favorites" onClick={closeMobileMenu}>Favorites</Link></li>
                <li className="dropdown-item"><Link to="/collections" onClick={closeMobileMenu}>Collections</Link></li>
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
                {currentUser ? (
                  <li className="dropdown-item">
                    <div onClick={() => { openModal('logout'); closeMobileMenu(); }}>
                      Log out ({currentUser.email})
                    </div>
                  </li>
                ) : (
                  <>
                    <li className="dropdown-item">
                      <div onClick={() => { openModal('signup'); closeMobileMenu(); }}>Sign in</div>
                    </li>
                    <li className="dropdown-item">
                      <div onClick={() => { openModal('login'); closeMobileMenu(); }}>Log in</div>
                    </li>
                  </>
                )}
                <li className="dropdown-item"><Link to="/support" onClick={closeMobileMenu}>Help and Support</Link></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;