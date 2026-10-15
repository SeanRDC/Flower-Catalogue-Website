import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { API_BASE_URL } from './api/client';
import { ToastProvider } from './context/ToastContext';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { pageMotion, useMotionPreset } from './utils/motion';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import './styles/global.css';

// Everything except the landing page is loaded on demand
const Browse = lazy(() => import('./components/Browse'));
const Feedback = lazy(() => import('./components/Feedback'));
const Survey = lazy(() => import('./components/Survey'));
const Support = lazy(() => import('./components/Support'));
const Favorites = lazy(() => import('./components/Favorites'));
const Collections = lazy(() => import('./components/Collections'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotFound = lazy(() => import('./components/NotFound'));

const AnimatedRoutes = () => {
  const location = useLocation();
  const pageAnimation = useMotionPreset(pageMotion);

  return (
    // Every page fades in the same way; the old page fades out first, and the
    // scroll resets only once it is gone, so it never visibly jumps to the top
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div key={location.pathname} {...pageAnimation}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes location={location}>
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
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {

  useEffect(() => {
    // Wake the free-tier Render backend early so the first real request is fast
    fetch(`${API_BASE_URL}/api/health`)
      .then(() => console.log('Backend successfully awakened!'))
      .catch((err) => console.log('Waking backend...', err));
  }, []);

  return (
    // reducedMotion="user": Framer animations follow the OS "reduce motion" setting
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="app-container">
              <Navbar />
              <AuthModal />

              <AnimatedRoutes />

              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;