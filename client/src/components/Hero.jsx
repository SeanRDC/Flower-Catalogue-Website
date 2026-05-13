import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css'; 
import heroImage from '../assets/heroimage.jpg';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const { openModal, currentUser } = useAuth();

  useEffect(() => {
    document.title = "Home | Peony";
  }, []);

  return (
    <section className="hero-section">
      <img className="hero-background" src={heroImage} alt="Beautiful featured flower" />
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="main-text">
          <h1>Find the Flower<br />That Speaks To<br />Your Heart</h1>
          <p>
            Whether you're seeking the perfect bouquet, exploring rare blossoms, 
            or simply indulging in nature's artistry, this space is designed to 
            help you fall in love with flowers all over again.
          </p>
        </div>
        <div className="main-buttons">
          <button onClick={() => navigate('/browse')} className="browse-now-button">
            Browse Now
          </button>
        
          {!currentUser ? (
            <button 
              className="log-in-button" 
              onClick={() => openModal('signup')}
            >
              Sign in
            </button>
          ) : (
            <button 
              className="log-in-button" 
              onClick={() => navigate('/favorites')}
            >
              My Favorites
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;