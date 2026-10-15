import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/FilterBar.css';

// Filter groups shown in the bar: label -> field name used by the API
const FILTER_GROUPS = [
  { key: 'color', label: 'Color' },
  { key: 'petalShape', label: 'Petal Shape' },
  { key: 'type', label: 'Type' },
  { key: 'symbolism', label: 'Symbolism' },
];

// `selected` is controlled by the page (and mirrored in the URL), `facets`
// comes from /api/flowers/facets: { color: [{ value, count }], ... }.
const FilterBar = ({ selected = {}, facets, total, onChange }) => {
  const [activeTab, setActiveTab] = useState(null);
  const containerRef = useRef(null);

  // Close the open options strip on outside click or Escape
  useEffect(() => {
    if (!activeTab) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setActiveTab(null);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveTab(null);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [activeTab]);

  const hasSelection = FILTER_GROUPS.some(({ key }) => selected[key]);

  const handleOptionSelect = (key, value) => {
    onChange({ ...selected, [key]: selected[key] === value ? '' : value });
  };

  const clearAll = () => {
    onChange({});
    setActiveTab(null);
  };

  const options = activeTab ? facets?.[activeTab] : null;
  const activeLabel = FILTER_GROUPS.find((g) => g.key === activeTab)?.label;

  return (
    <div className="filter-system-container" ref={containerRef}>
      <div className="main-filter-bar">
        <span className="filter-label">Filters:</span>

        <div className="filter-tabs">
          {FILTER_GROUPS.map(({ key, label }) => (
            <button
              key={key}
              className={`filter-tab-btn ${activeTab === key ? 'active' : ''} ${selected[key] ? 'has-selection' : ''}`}
              onClick={() => setActiveTab(activeTab === key ? null : key)}
              aria-expanded={activeTab === key}
              aria-controls="filter-options-panel"
              aria-label={selected[key] ? `${label}: ${selected[key]} selected` : label}
            >
              <span className="bold-safe" data-text={label}>{label}</span>
              <svg
                className={`filter-chevron ${activeTab === key ? 'rotate' : ''}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          ))}
        </div>

        {/* Always rendered (fixed width) so the tabs never shift as it fills in */}
        <div className="filter-summary">
          {typeof total === 'number' && (
            <span aria-live="polite">{total} {total === 1 ? 'flower' : 'flowers'}</span>
          )}
          {hasSelection && (
            <button className="filter-clear-all" onClick={clearAll}>Clear all</button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeTab && (
          <motion.div
            id="filter-options-panel"
            className="sub-filter-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="sub-filter-options" role="group" aria-label={`${activeLabel} options`}>
              {!options ? (
                <span className="sub-filter-loading">Loading…</span>
              ) : (
                options.map(({ value, count }) => {
                  const isSelected = selected[activeTab] === value;
                  // Keep a selected option clickable so it can be turned off
                  const disabled = count === 0 && !isSelected;
                  return (
                    <button
                      key={value}
                      className={`sub-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(activeTab, value)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      title={disabled ? 'No flowers match this with your other filters' : `${count} ${count === 1 ? 'flower' : 'flowers'}`}
                    >
                      <span className="bold-safe" data-text={value}>{value}</span>
                    </button>
                  );
                })
              )}
              {hasSelection && (
                <button className="sub-option-btn clear-option" onClick={clearAll}>Clear all</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
