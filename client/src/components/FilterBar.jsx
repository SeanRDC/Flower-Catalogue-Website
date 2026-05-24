import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/FilterBar.css';

const FilterBar = ({ onFilterSelect }) => {
  const [activeTab, setActiveTab] = useState(null);
  
  const [selectedFilters, setSelectedFilters] = useState({
    Color: '',
    'Petal Shape': '',
    Type: '',
    Symbolism: ''
  });

  const filterCategories = {
    Color: ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Blue', 'Orange', 'Green'],
    'Petal Shape': ['Rounded', 'Pointed', 'Ruffled', 'Spider-like'],
    Type: ['Rose', 'Lily', 'Tulip', 'Orchid', 'Daisy', 'Peony', 'Carnation', 'Other'],
    Symbolism: ['Love', 'Purity', 'Friendship', 'Strength', 'Peace', 'Joy']
  };

  const handleTabClick = (tabName) => {
    if (activeTab === tabName) {
      setActiveTab(null);
    } else {
      setActiveTab(tabName);
    }
  };

  const handleOptionSelect = (category, option) => {
    const newFilters = {
      ...selectedFilters,
      [category]: selectedFilters[category] === option ? '' : option 
    };
    
    setSelectedFilters(newFilters);
    
    if (onFilterSelect) {
      onFilterSelect(newFilters);
    }
  };

  return (
    <div className="filter-system-container">
      <div className="main-filter-bar">
        <span className="filter-label">Filters:</span>
        
        <div className="filter-tabs">
          {Object.keys(filterCategories).map((category) => (
            <button 
              key={category}
              className={`filter-tab-btn ${activeTab === category ? 'active' : ''} ${selectedFilters[category] ? 'has-selection' : ''}`}
              onClick={() => handleTabClick(category)}
            >
              {category}
              <svg 
                className={`filter-chevron ${activeTab === category ? 'rotate' : ''}`} 
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTab && (
          <motion.div 
            className="sub-filter-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="sub-filter-options">
              {filterCategories[activeTab].map((option) => (
                <button
                  key={option}
                  className={`sub-option-btn ${selectedFilters[activeTab] === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(activeTab, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;