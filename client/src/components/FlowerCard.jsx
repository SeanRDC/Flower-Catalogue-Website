import { useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import ProgressiveImage from './ProgressiveImage';

// One catalogue card. Collapsed, the whole card opens it; expanded, it shows
// the flower's details and actions, and only the close button collapses it
// (so selecting text or missing a button doesn't snap it shut).
//
// `actions` is a list of { label, icon: Icon, onClick, active, danger }.
const FlowerCard = ({ flower, index = 0, isExpanded, onToggle, onFullscreen, actions = [] }) => {
  const cardRef = useRef(null);
  // Parents pass a new onToggle function every render; keep the latest one in
  // a ref so the effect below only runs when the card opens or closes.
  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  });

  // Bring a newly expanded card fully into view, and let Escape close it
  useEffect(() => {
    if (!isExpanded) return;

    // Wait for the open animation and grid reflow to finish, then scroll just
    // enough to show the whole card below the fixed navbar
    const timer = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0;
      const topLimit = Math.max(headerBottom, 0) + 16;
      const bottomLimit = window.innerHeight - 16;

      let delta = 0;
      if (rect.top < topLimit || rect.height > bottomLimit - topLimit) {
        delta = rect.top - topLimit;
      } else if (rect.bottom > bottomLimit) {
        delta = rect.bottom - bottomLimit;
      }

      if (Math.abs(delta) > 1) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollBy({ top: delta, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }, 380);

    const handleKey = (e) => {
      if (e.key === 'Escape') onToggleRef.current();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isExpanded]);

  const cascadeDelay = index >= 8 ? ((index - 8) % 12) * 0.05 : 0;

  const details = [
    flower.lifecycle,
    flower.color,
    flower.petalShape && `${flower.petalShape} petals`,
    flower.symbolism && `Symbolizes ${flower.symbolism.toLowerCase()}`,
  ].filter(Boolean);

  const collapsedProps = isExpanded ? {} : {
    role: 'button',
    tabIndex: 0,
    'aria-expanded': false,
    'aria-label': `Show details for ${flower.commonName}`,
    onClick: onToggle,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
  };

  return (
    <article
      ref={cardRef}
      className={`top-pick ${isExpanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${cascadeDelay}s` }}
      {...collapsedProps}
    >
      <div className="image-wrapper">
        <ProgressiveImage
          className="images"
          src={flower.imageUrl}
          alt={flower.commonName}
          sizes={isExpanded ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
          onClick={isExpanded ? onFullscreen : undefined}
          title={isExpanded ? 'View full size' : undefined}
        />
        {isExpanded && (
          <>
            <button className="card-close-btn" onClick={onToggle} aria-label="Close details" title="Close">
              <X size={20} />
            </button>
            <button className="expand-fullscreen-btn" onClick={onFullscreen} aria-label="View full size">
              <Maximize2 size={16} />
              <span>Full size</span>
            </button>
          </>
        )}
      </div>

      <div className="card-content-wrapper">
        <div className="description">
          <h3 className="product-name-item">{flower.commonName}</h3>
          {isExpanded && flower.scientificName && (
            <p className="scientific-name">
              {flower.scientificName}
              {flower.family && <span className="family-name"> · {flower.family}</span>}
            </p>
          )}
          <p className="sort-description">{flower.description}</p>

          {isExpanded && details.length > 0 && (
            <ul className="detail-chips">
              {details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          )}
        </div>

        {isExpanded && actions.length > 0 && (
          <div className="action-bar">
            {actions.map(({ label, icon: Icon, onClick, active, danger }) => (
              <button
                key={label}
                className={`card-action ${active ? 'active' : ''} ${danger ? 'danger' : ''}`}
                onClick={onClick}
                aria-pressed={active === undefined ? undefined : active}
              >
                <Icon size={18} fill={active ? 'currentColor' : 'none'} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default FlowerCard;
