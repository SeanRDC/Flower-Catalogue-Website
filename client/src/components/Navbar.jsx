import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import peonyLogo from '../assets/peony-logo.jpg';
import '../styles/Navbar.css';

const Navbar = ({ onSearchClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const isBrowsePage = location.pathname === '/browse';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (isBrowsePage) {
      onSearchClick();
    } else {
      navigate('/browse');
    }
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
        
        <form className="search-bar" onClick={handleSearchClick} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Find a Flower..." 
            readOnly
          />
          <button type="submit" className="search-button">
            <Search size={18} color="#666" />
          </button>
        </form>
      </div>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? (
          <X size={28} color="#666" />
        ) : (
          <Menu size={28} color="#666" />
        )}
      </button>

      <nav className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item full-width-click">
            <Link className="home-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li className="nav-item dropdown-trigger full-width-click" onClick={() => toggleDropdown('assets')}>
            <div className="nav-item-content">
              <span>Assets</span>
              <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'assets' ? 'rotate' : ''}`} />
            </div>
            
            <div className={`dropdown-menu ${activeDropdown === 'assets' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item">
                  <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>Favorites</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
                </li>
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
                <li className="dropdown-item">
                  <div onClick={() => setIsMobileMenuOpen(false)}>Sign in</div>
                </li>
                <li className="dropdown-item">
                  <div onClick={() => setIsMobileMenuOpen(false)}>Log in</div>
                </li>
                <li className="dropdown-item">
                  <Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Help and Support</Link>
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