import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { optimizeImage } from '../utils/image';

// Rendered into <body> through a portal: page wrappers use CSS transforms for
// their animations, which would otherwise trap this fixed overlay inside them.
const FullscreenImage = ({ src, alt = 'Fullscreen bloom', caption, onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);
  // Keep the latest onClose without re-running the setup effect each render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        // Close only the viewer, not the expanded card underneath it
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey, true);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey, true);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div className="fullscreen-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt}>
      <button ref={closeRef} className="close-fullscreen-btn" onClick={onClose} aria-label="Close full size image">
        <X size={26} />
      </button>

      <figure className="fullscreen-figure" onClick={(e) => e.stopPropagation()}>
        {!loaded && <div className="fullscreen-spinner" aria-hidden="true" />}
        <img
          src={optimizeImage(src, 1600)}
          alt={alt}
          className={`fullscreen-image-view ${loaded ? 'loaded' : ''}`}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        {caption && <figcaption className="fullscreen-caption">{caption}</figcaption>}
      </figure>
    </div>,
    document.body
  );
};

export default FullscreenImage;
