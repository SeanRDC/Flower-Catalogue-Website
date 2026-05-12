import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Feedback from './components/Feedback';
import Survey from './components/Survey';
import Footer from './components/Footer';
import Support from './components/Support';
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;