import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { API_BASE_URL } from './api/client';
import { ToastProvider } from './context/ToastContext';
import { AnimatePresence } from 'framer-motion';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />} key={location.pathname}>
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
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="app-container">
            <ScrollToTop />
            <Navbar />
            <AuthModal />

            <AnimatedRoutes />

            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;