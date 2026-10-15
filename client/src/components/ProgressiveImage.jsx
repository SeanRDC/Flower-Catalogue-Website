import { useState } from 'react';
import { optimizeImage, buildSrcSet, FALLBACK_IMAGE } from '../utils/image';
import '../styles/ProgressiveImage.css';

const ProgressiveImage = ({
  src,
  alt,
  className = '',
  width = 600,
  sizes = '(max-width: 600px) 50vw, 300px',
  srcSetWidths,
  eager = false,
  ...rest
}) => {
  const [status, setStatus] = useState('loading');
  const failed = status === 'error';

  return (
    <img
      {...rest}
      src={failed ? FALLBACK_IMAGE : optimizeImage(src, width)}
      srcSet={failed ? undefined : buildSrcSet(src, srcSetWidths)}
      sizes={failed ? undefined : sizes}
      alt={alt}
      className={`progressive-img ${status === 'loading' ? 'loading' : 'loaded'} ${className}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setStatus((s) => (s === 'error' ? s : 'loaded'))}
      onError={() => setStatus('error')}
    />
  );
};

export default ProgressiveImage;
