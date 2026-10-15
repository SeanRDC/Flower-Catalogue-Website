import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import peonyLogo from '../assets/peony-logo.webp';
import '../styles/Navbar.css';
import { useAuth } from '../context/useAuth';
import { apiClient } from '../api/client';
import ProgressiveImage from './ProgressiveImage';

// Pages that show the search bar; everything else (info pages, 404) hides it
const SEARCH_PAGES = ['/', '/browse', '/favorites', '/collections'];
const ASSET_PAGES = ['/favorites', '/collections'];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, openModal } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search') || '';
  const isNewsfeedMode = searchParams.get('view') === 'all';
  const isAssetPage = ASSET_PAGES.includes(location.pathname);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const headerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Keep the navbar in sync with the URL: the search box mirrors ?search=,
  // and any navigation (links, back/forward) closes open menus. Adjusting
  // state during render avoids a flash of stale UI after the route changes.
  const routeKey = location.pathname + location.search;
  const [prevRouteKey, setPrevRouteKey] = useState(routeKey);
  if (routeKey !== prevRouteKey) {
    setPrevRouteKey(routeKey);
    setSearchQuery(urlSearch);
    setSuggestions([]);
    setIsSearchFocused(false);
    setHighlighted(-1);
    setActiveDropdown(null);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }

  // Pages with a photo banner use the light navbar text over the image
  const hasBanner = (location.pathname === '/browse' && !isNewsfeedMode && !urlSearch) || isAssetPage;
  const showSearch = SEARCH_PAGES.includes(location.pathname);
  // Saved-flower pages search within the user's own list, so no global suggestions
  const showSuggestions = !isAssetPage;

  let searchPlaceholder = 'Find a Flower...';
  if (location.pathname === '/favorites') searchPlaceholder = 'Search your favorites...';
  else if (location.pathname === '/collections') searchPlaceholder = 'Search your collections...';
  else if (currentCategory) searchPlaceholder = `Search ${currentCategory.toLowerCase()}s...`;

  const trimmedQuery = searchQuery.trim();
  const dropdownVisible = showSuggestions && isSearchFocused && trimmedQuery.length >= 2 && trimmedQuery !== urlSearch;
  const noMatches = dropdownVisible && !isSearching && suggestions.length === 0;

  // Debounced suggestions; responses for outdated queries are dropped
  useEffect(() => {
    const query = searchQuery.trim();
    if (!showSuggestions || query.length < 2 || query === urlSearch) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiClient.get('/flowers', {
          params: { search: query, limit: 5 },
          signal: controller.signal,
        });
        setSuggestions(res.data.flowers || []);
        setHighlighted(-1);
      } catch (err) {
        if (!controller.signal.aborted) console.error(err);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery, showSuggestions, urlSearch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // Mirror of isMobileMenuOpen for event handlers registered once
  const mobileOpenRef = useRef(false);
  useEffect(() => {
    mobileOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setActiveDropdown(null);
    if (!mobileOpenRef.current) return;
    setIsMobileMenuOpen(false);
    // Keep the solid header background while the menu slides closed
    setIsClosing(true);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsClosing(false), 400);
  };

  // Outside clicks close menus and suggestions; Escape does too
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        closeMobileMenu();
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    const handleKey = (event) => {
      if (event.key !== 'Escape') return;
      setActiveDropdown(null);
      setIsSearchFocused(false);
      closeMobileMenu();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const goToFlower = (flower) => {
    navigate(`/browse?search=${encodeURIComponent(flower.commonName)}`);
    closeMobileMenu();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (highlighted >= 0 && suggestions[highlighted] && dropdownVisible) {
      goToFlower(suggestions[highlighted]);
      return;
    }

    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) params.set('search', query);

    if (isAssetPage) {
      navigate(`${location.pathname}${query ? `?${params}` : ''}`);
    } else {
      if (currentCategory) params.set('category', currentCategory);
      const qs = params.toString();
      navigate(qs ? `/browse?${qs}` : '/browse');
    }
    setIsSearchFocused(false);
    closeMobileMenu();
  };

  const handleSearchKeyDown = (e) => {
    if (!dropdownVisible || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown((current) => (current === menu ? null : menu));
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
      setActiveDropdown(null);
    }
  };

  const openAuth = (mode) => {
    closeMobileMenu();
    setTimeout(() => openModal(mode), 150);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${(isMobileMenuOpen || isClosing) ? 'mobile-active' : ''} ${hasBanner ? 'browse-mode' : ''} ${isNewsfeedMode ? 'newsfeed-header' : ''} ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="header-left">
        <Link to="/" className="logo-link" onClick={closeMobileMenu} aria-label="Peony home">
          <img className="peony-logo-nav" src={peonyLogo} alt="Peony logo" width="50" height="50" />
        </Link>

        {showSearch && (
          <div className="search-container" ref={searchContainerRef}>
            <form
              className={`search-bar ${noMatches ? 'not-found-outline' : ''}`}
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <input
                type="search"
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                value={searchQuery}
                autoComplete="off"
                role="combobox"
                aria-expanded={dropdownVisible}
                aria-controls="search-suggestions"
                aria-autocomplete="list"
                aria-activedescendant={highlighted >= 0 ? `suggestion-${highlighted}` : undefined}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (e.target.value.trim().length < 2) setSuggestions([]);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="submit" className="search-button" aria-label="Search">
                <Search size={18} color="#666" />
              </button>
            </form>

            {dropdownVisible && (
              <div className="search-dropdown">
                {isSearching && suggestions.length === 0 ? (
                  <div className="search-dropdown-message">Searching...</div>
                ) : suggestions.length > 0 ? (
                  <ul className="search-dropdown-list" id="search-suggestions" role="listbox">
                    {suggestions.map((flower, index) => (
                      <li
                        key={flower._id}
                        id={`suggestion-${index}`}
                        role="option"
                        aria-selected={highlighted === index}
                        className={`search-dropdown-item ${highlighted === index ? 'highlighted' : ''}`}
                        onMouseEnter={() => setHighlighted(index)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          goToFlower(flower);
                        }}
                      >
                        <ProgressiveImage
                          src={flower.imageUrl}
                          alt=""
                          className="search-dropdown-img"
                          width={80}
                          srcSetWidths={[80, 160]}
                          sizes="40px"
                          eager
                        />
                        <div className="search-dropdown-text">
                          <span className="search-dropdown-title">{flower.commonName}</span>
                          <span className="search-dropdown-subtitle">{flower.lifecycle}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="search-dropdown-message">No flowers match "{trimmedQuery}"</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls="main-navigation"
      >
        {isMobileMenuOpen ? <X size={28} color="#666" /> : <Menu size={28} color="#666" />}
      </button>

      <nav id="main-navigation" className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main">
        <ul className="nav-list">
          <li className="nav-item full-width-click">
            <Link className="home-link" to="/" onClick={closeMobileMenu} aria-current={location.pathname === '/' ? 'page' : undefined}>Home</Link>
          </li>

          <li className={`nav-item dropdown-trigger full-width-click ${activeDropdown === 'assets' ? 'active' : ''}`}>
            <button
              className="nav-item-content"
              onClick={() => toggleDropdown('assets')}
              aria-expanded={activeDropdown === 'assets'}
              aria-haspopup="true"
            >
              <span>Assets</span>
              <ChevronDown size={16} className="chevron-icon" aria-hidden="true" />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'assets' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item"><Link to="/favorites" onClick={closeMobileMenu}>Favorites</Link></li>
                <li className="dropdown-item"><Link to="/collections" onClick={closeMobileMenu}>Collections</Link></li>
              </ul>
            </div>
          </li>

          <li className={`nav-item dropdown-trigger full-width-click ${activeDropdown === 'profile' ? 'active' : ''}`}>
            <button
              className="nav-item-content"
              onClick={() => toggleDropdown('profile')}
              aria-expanded={activeDropdown === 'profile'}
              aria-haspopup="true"
            >
              <span>Profile</span>
              <ChevronDown size={16} className="chevron-icon" aria-hidden="true" />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'profile' ? 'active' : ''}`}>
              <ul>
                {currentUser ? (
                  <>
                    <li className="dropdown-header">
                      <span>Signed in as</span>
                      <strong title={currentUser.email}>{currentUser.email}</strong>
                    </li>
                    <li className="dropdown-item">
                      <button onClick={() => openAuth('logout')}>Log out</button>
                    </li>
                  </>
                ) : (
                  <li className="dropdown-item">
                    <button onClick={() => openAuth('login')}>Log in / Sign up</button>
                  </li>
                )}
                <li className="dropdown-item">
                  <Link to="/support" onClick={closeMobileMenu}>Help and Support</Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
