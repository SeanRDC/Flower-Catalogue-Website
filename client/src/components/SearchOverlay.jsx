import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import '../styles/SearchOverlay.css';

const SearchOverlay = ({ onClose, onSearch, currentQuery }) => {
  const [query, setQuery] = useState(currentQuery || '');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-header">
        <button className="search-overlay-close" onClick={handleCloseClick}>
          <X size={28} />
        </button>
      </div>

      <div className="search-overlay-content">
        <div className="search-overlay-bar">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search your desire flower..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="search-overlay-icons">
            <button className="icon-btn search-submit-btn" onClick={() => query.trim() && onSearch(query.trim())}>
              <Search size={22} />
            </button>
            <button className="icon-btn filter-btn">
              <SlidersHorizontal size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;