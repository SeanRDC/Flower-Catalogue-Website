import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/browse'); 
  };

  return (
    <section className="hero-section">
      <div className="hero-left">
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
      
      <div className="hero-right">
        <img 
          className="hero-image-main" 
          src="https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1200&q=80" 
          alt="Beautiful pink flowers" 
        />
      </div>
    </section>
  );
};

export default Hero;