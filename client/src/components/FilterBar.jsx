import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import '../styles/FilterBar.css';

// Filter groups shown in the bar: label -> field name used by the API
const FILTER_GROUPS = [
  { key: 'color', label: 'Color' },
  { key: 'petalShape', label: 'Petal Shape' },
  { key: 'type', label: 'Type' },
  { key: 'symbolism', label: 'Symbolism' },
];

const SWATCHES = {
  Red: '#c62828', Pink: '#ec7fa9', White: '#ffffff', Yellow: '#f4c430',
  Purple: '#7e57c2', Blue: '#3f7fd6', Orange: '#f08a24', Green: '#5f9e4a',
};

// `selected` is controlled by the page (and mirrored in the URL), `facets`
// comes from /api/flowers/facets: { color: [{ value, count }], ... }.
const FilterBar = ({ selected = {}, facets, total, onChange }) => {
  const [openGroup, setOpenGroup] = useState(null);
  const containerRef = useRef(null);

  // Close the open panel on outside click or Escape
  useEffect(() => {
    if (!openGroup) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpenGroup(null);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpenGroup(null);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openGroup]);

  const activeCount = FILTER_GROUPS.filter(({ key }) => selected[key]).length;

  const setValue = (key, value) => {
    onChange({ ...selected, [key]: selected[key] === value ? '' : value });
  };

  const clearGroup = (key) => onChange({ ...selected, [key]: '' });
  const clearAll = () => {
    onChange({});
    setOpenGroup(null);
  };

  const openOptions = openGroup ? facets?.[openGroup] : null;

  return (
    <div className="filter-system-container" ref={containerRef}>
      <div className="main-filter-bar">
        <span className="filter-label">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
        </span>

        <div className="filter-tabs" role="group" aria-label="Filter flowers">
          {FILTER_GROUPS.map(({ key, label }) => {
            const value = selected[key];
            const isOpen = openGroup === key;
            return (
              <div key={key} className={`filter-tab ${value ? 'has-selection' : ''} ${isOpen ? 'active' : ''}`}>
                <button
                  className="filter-tab-btn"
                  onClick={() => setOpenGroup(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  aria-controls="filter-options-panel"
                >
                  <span>{label}{value && <span className="filter-tab-value">: {value}</span>}</span>
                  <svg
                    className={`filter-chevron ${isOpen ? 'rotate' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {value && (
                  <button className="filter-tab-clear" onClick={() => clearGroup(key)} aria-label={`Clear ${label} filter`}>
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="filter-summary">
          {typeof total === 'number' && (
            <span className="filter-total" aria-live="polite">
              {total} {total === 1 ? 'flower' : 'flowers'}
            </span>
          )}
          {activeCount > 0 && (
            <button className="filter-clear-all" onClick={clearAll}>Clear all</button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {openGroup && (
          <motion.div
            id="filter-options-panel"
            className="sub-filter-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="sub-filter-options" role="group" aria-label={`${FILTER_GROUPS.find((g) => g.key === openGroup).label} options`}>
              {!openOptions ? (
                <span className="sub-filter-loading">Loading options…</span>
              ) : (
                openOptions.map(({ value, count }) => {
                  const isSelected = selected[openGroup] === value;
                  // Keep a selected option clickable so it can be turned off
                  const disabled = count === 0 && !isSelected;
                  return (
                    <button
                      key={value}
                      className={`sub-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setValue(openGroup, value)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      title={disabled ? 'No flowers match this with your other filters' : undefined}
                    >
                      {openGroup === 'color' && (
                        <span className="color-swatch" style={{ background: SWATCHES[value] }} aria-hidden="true" />
                      )}
                      {value}
                      <span className="option-count">{count}</span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
