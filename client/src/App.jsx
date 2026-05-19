import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { AnimatePresence } from 'framer-motion';
import AuthModal from './components/AuthModal';       
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Feedback from './components/Feedback';
import Survey from './components/Survey';
import Footer from './components/Footer';
import Support from './components/Support';
import Favorites from './components/Favorites';
import Collections from './components/Collections';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import './styles/global.css'; 

const AnimatedRoutes = () => {
  const location = useLocation(); 

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/support" element={<Support />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />   
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {

  useEffect(() => {
    fetch('https://flower-catalogue-website.onrender.com/api/flowers?limit=1')
      .then(() => console.log('Backend successfully awakened!'))
      .catch((err) => console.log('Waking backend...', err));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ScrollToTop />
          <Navbar />
          <AuthModal />
          
          <AnimatedRoutes />
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;