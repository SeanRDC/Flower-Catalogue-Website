// Downloads the original, full-resolution image. Some hosts block
// cross-origin downloads, so fall back to opening the image in a new tab.
export const downloadImage = (url, name) =>
  fetch(url, { referrerPolicy: 'no-referrer' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${name.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    })
    .catch((err) => {
      console.error('Error downloading image:', err);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
