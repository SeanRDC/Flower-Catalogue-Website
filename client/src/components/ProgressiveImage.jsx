import { useState } from 'react';
import '../styles/ProgressiveImage.css';

const ProgressiveImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`progressive-img-wrapper ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`progressive-img ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default ProgressiveImage;