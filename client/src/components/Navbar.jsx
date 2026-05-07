import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/browse');
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  return (
    <header className={`header ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Find a Flower..." />
        <button type="submit" className="search-button">
          <Search size={18} color="#666" />
        </button>
      </form>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={28} color="#5a6c3a" /> : <Menu size={28} color="#5a6c3a" />}
      </button>

      <nav className={`nav-bar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <Link className="home-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Home</span>
            </Link>
          </li>

          <li className="nav-item dropdown-trigger" onClick={() => toggleDropdown('assets')}>
            <span>Assets</span>
            <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'assets' ? 'rotate' : ''}`} />
            
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

          <li className="nav-item dropdown-trigger" onClick={() => toggleDropdown('profile')}>
            <span>Profile</span>
            <ChevronDown size={16} className={`chevron-icon ${activeDropdown === 'profile' ? 'rotate' : ''}`} />
            
            <div className={`dropdown-menu ${activeDropdown === 'profile' ? 'active' : ''}`}>
              <ul>
                <li className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Sign in</li>
                <li className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Log in</li>
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