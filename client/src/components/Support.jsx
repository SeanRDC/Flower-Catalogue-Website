import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Support.css';

const Support = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Help & Support | Peony';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="desktop-home-page short-header-page">
      {/* Unified Wavy Header */}
      <div className="subpage-hero-header">
        <div className="vector-container">
          <img 
            className="vector" 
            src="https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80" 
            alt="Header background" 
          />
          <svg className="wave-svg-clip">
            <defs>
              <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 L 0,0.75 Q 0.125,0.85 0.25,0.75 Q 0.375,0.65 0.5,0.75 Q 0.625,0.85 0.75,0.75 Q 0.875,0.65 1,0.75 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <main className="support-content">
        <div className="support-card">
          <span className="support-icon">🛠️</span>
          <h1>404 Not Found</h1>
          <p className="description">
            Heads up! We're still building this part of the site. Fresh blooms are coming soon!
          </p>
          <button className="back-home-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default Support;