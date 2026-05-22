import { useState } from 'react';
import { motion } from 'framer-motion';

const FlowerCard = ({ flower }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation(); 
    console.log(`Added ${flower.commonName} to backend favorites`);
  };

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`flower-card ${isExpanded ? 'expanded' : ''}`}
      transition={{ layout: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }}
    >
      <motion.img 
        layout="position"
        src={flower.imageUrl} 
        alt={flower.commonName} 
        loading="lazy" 
      />
      
      <motion.div layout className="card-content">
        <motion.h3 layout>{flower.commonName}</motion.h3>
        <motion.p layout className="scientific">{flower.scientificName}</motion.p>
        
        <motion.button 
          layout
          onClick={handleFavorite} 
          className="action-btn"
        >
          Save to Favorites
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FlowerCard;