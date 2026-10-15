import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import '../styles/Hero.css'; 
import { useAuth } from '../context/useAuth';
import { EASE, DURATION } from '../utils/motion';

const Hero = () => {
  const navigate = useNavigate();
  const { openModal, currentUser } = useAuth();
  // With reduce motion on, show everything immediately (no fades or stagger)
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Home | Peony";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // Starts partway through the page fade-in, items follow in a steady rhythm
        staggerChildren: 0.15,
        delayChildren: DURATION.fast,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: DURATION.entrance, ease: EASE }
    }
  };

  return (
    <section className="hero-section">
      <motion.img 
        className="hero-background" 
        src="/hero-1600.webp"
        srcSet="/hero-960.webp 960w, /hero-1600.webp 1600w, /hero-2400.webp 2400w"
        sizes="100vw"
        alt="Beautiful featured flower"
        fetchPriority="high"
        decoding="async"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <div className="hero-overlay"></div>

      <motion.div 
        className="hero-content"
        initial={reduceMotion ? false : 'hidden'}
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