import { useEffect } from 'react';

const Browse = () => {
  useEffect(() => {
    document.title = "Browse | Peony";
  }, []);

  return (
    <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Browse Page</h1>
      <p>Your MongoDB flowers will appear here soon!</p>
    </div>
  );
};

export default Browse;