import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Footer from './components/Footer';
import './styles/global.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;