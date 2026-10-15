import { useEffect } from 'react';
import { X } from 'lucide-react';
import { optimizeImage } from '../utils/image';

const FullscreenImage = ({ src, alt = 'Fullscreen bloom', onClose }) => {
  // Close with Escape and stop the page behind from scrolling
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="fullscreen-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt}>
      <button className="close-fullscreen-btn" onClick={onClose} aria-label="Close fullscreen image">
        <X size={32} color="white" />
      </button>
      <img
        src={optimizeImage(src, 1600)}
        alt={alt}
        className="fullscreen-image-view"
        referrerPolicy="no-referrer"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default FullscreenImage;
