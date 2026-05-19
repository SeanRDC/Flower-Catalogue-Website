import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Support.css';

const Support = () => {
  useEffect(() => {
    document.title = 'Help & Support | Peony';
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div className="support-container">
      <div className="support-content">
        <h1 className="support-title">How can we help?</h1>
        
        <p className="support-text">
          We are currently building out our dedicated help center and ticketing system. 
          In the meantime, if you have questions about your collections or need immediate assistance, 
          we're just an email away.
        </p>
        
        <div className="support-actions">
          <a href="mailto:support@peony.com" className="support-email-link">
            support@peony.com
          </a>
          
          <div className="support-divider"></div>
          
          <Link to="/" className="support-home-link">
            Return to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;