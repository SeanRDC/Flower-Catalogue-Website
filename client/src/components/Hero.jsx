import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Hero.css'; 
import heroImage from '/heroimage.jpg';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { openModal, currentUser } = useAuth();

  useEffect(() => {
    document.title = "Home | Peony";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, 
        delayChildren: 0.3,    
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } 
    }
  };

  return (
    <section className="hero-section">
      <motion.img 
        className="hero-background" 
        src={heroImage} 
        alt="Beautiful featured flower" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <div className="hero-overlay"></div>

      <motion.div 
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="main-text">
          <motion.h1 variants={itemVariants}>
            Find the Flower<br />That Speaks To<br />Your Heart
          </motion.h1>
          <motion.p variants={itemVariants}>
            Whether you're seeking the perfect bouquet, exploring rare blossoms, 
            or simply indulging in nature's artistry, this space is designed to 
            help you fall in love with flowers all over again.
          </motion.p>
        </div>
        
        <motion.div className="main-buttons" variants={itemVariants}>
          <motion.button 
            onClick={() => navigate('/browse')} 
            className="browse-now-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Browse Now
          </motion.button>
        
          {!currentUser ? (
            <motion.button 
              className="log-in-button" 
              onClick={() => openModal('signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Sign in
            </motion.button>
          ) : (
            <motion.button 
              className="log-in-button" 
              onClick={() => navigate('/favorites')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              My Favorites
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;