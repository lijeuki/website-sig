// src/App.jsx
import MapPage from './pages/MapPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DataPage from './pages/DataPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen overflow-auto"> {/* Ganti overflow-hidden menjadi overflow-auto */}
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/peta" element={
            <div className="flex-1 w-full h-full flex flex-col relative">
              <MapPage />
            </div>
          } />
          <Route path="/data" element={<div className="p-4 h-full"><DataPage /></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;