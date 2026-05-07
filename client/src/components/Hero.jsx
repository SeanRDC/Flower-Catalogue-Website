import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css'; 

import heroImage from '../assets/heroimage.jpg';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className="hero-section">
      <a><img 
        className="hero-background" 
        src={heroImage} 
        alt="Beautiful featured flower" 
      /></a>
      <div className='hero-overlay'></div>
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
          <button 
            onClick={() => navigate('/browse')} 
            className="browse-now-button"
          >
            Browse Now
          </button>
          <button className="log-in-button">Sign in</button>
        </div>
      </div>
    </main>
  );
};

export default Hero;