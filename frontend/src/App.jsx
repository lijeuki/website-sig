// src/App.jsx - Updated dengan scroll yang berfungsi
import MapPage from './pages/MapPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DataPage from './pages/DataPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex-1 overflow-auto"> {/* Container untuk konten yang bisa di-scroll */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/peta" element={
              <div className="h-[calc(100vh-64px)]"> {/* 64px adalah perkiraan tinggi navbar */}
                <MapPage />
              </div>
            } />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;