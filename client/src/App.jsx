import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Feedback from './components/Feedback';
import Survey from './components/Survey';
import Footer from './components/Footer';
import Support from './components/Support';
import Favorites from './components/Favorites';
import Collections from './components/Collections';
import './styles/global.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/support" element={<Support />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;