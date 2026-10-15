// Flower photos come from third-party CDNs at full camera resolution
// (often 3-7 MB each). Most of those CDNs can resize on the fly, so we ask
// for an appropriately sized, compressed variant instead of the original.
// Wikimedia is left alone: it only serves a fixed set of thumbnail widths.

export const FALLBACK_IMAGE = '/flower-fallback.svg';

const setParams = (url, params) => {
  try {
    const parsed = new URL(url);
    Object.entries(params).forEach(([key, value]) => parsed.searchParams.set(key, value));
    return parsed.toString();
  } catch {
    return url;
  }
};

export const optimizeImage = (url, width = 600) => {
  if (!url) return FALLBACK_IMAGE;

  // Fix a known typo in the seeded data (".jpe" instead of ".jpeg").
  const src = url.replace(/\.jpe$/i, '.jpeg');

  if (src.includes('images.pexels.com')) {
    return setParams(src, { auto: 'compress', cs: 'tinysrgb', w: width });
  }
  if (src.includes('images.unsplash.com')) {
    return setParams(src, { auto: 'format', fit: 'crop', w: width, q: 75 });
  }
  if (src.includes('/cdn/shop/')) {
    return setParams(src, { width });
  }
  if (src.includes('.wordpress.com/')) {
    return setParams(src, { w: width });
  }

  return src;
};

const RESIZABLE_HOSTS = ['images.pexels.com', 'images.unsplash.com', '/cdn/shop/', '.wordpress.com/'];

export const buildSrcSet = (url, widths = [320, 480, 640, 960]) => {
  if (!url || !RESIZABLE_HOSTS.some((host) => url.includes(host))) return undefined;
  return widths.map((w) => `${optimizeImage(url, w)} ${w}w`).join(', ');
};

// Shared banner photo used at the top of several pages.
export const HEADER_IMAGE = 'https://images.unsplash.com/photo-1520763185298-1b434c919102';

export const headerImageProps = {
  src: optimizeImage(HEADER_IMAGE, 1600),
  srcSet: buildSrcSet(HEADER_IMAGE, [768, 1280, 1920]),
  sizes: '100vw',
  alt: '',
  decoding: 'async',
  fetchPriority: 'high',
};
