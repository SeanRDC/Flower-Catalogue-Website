import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/browse');
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="header">
      <form className="search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Find a Flower..." />
        <button type="submit" className="search-button">
          <Search size={18} color="#666" />
        </button>
      </form>

      <nav className="nav-bar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link className="home-link" to="/">
              <span>Home</span>
            </Link>
          </li>

          {/* ASSETS DROPDOWN */}
          <li 
            className="nav-item dropdown-trigger" 
            onClick={() => toggleDropdown('assets')}
          >
            <span>Assets</span>
            <ChevronDown 
              size={16} 
              className={`chevron-icon ${activeDropdown === 'assets' ? 'rotate' : ''}`} 
            />
            
            {activeDropdown === 'assets' && (
              <div className="dropdown-menu active">
                <ul>
                  <li className="dropdown-item">
                    <Link to="/favorites">Favorites</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/collections">Collections</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/account">Account</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* PROFILE DROPDOWN */}
          <li 
            className="nav-item dropdown-trigger" 
            onClick={() => toggleDropdown('profile')}
          >
            <span>Profile</span>
            <ChevronDown 
              size={16} 
              className={`chevron-icon ${activeDropdown === 'profile' ? 'rotate' : ''}`} 
            />
            
            {activeDropdown === 'profile' && (
              <div className="dropdown-menu active">
                <ul>
                  <li className="dropdown-item">Sign in</li>
                  <li className="dropdown-item">Log in</li>
                  <li className="dropdown-item">
                    <Link to="/support">Help and Support</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;