// src/App.jsx
import MapComponent from './components/MapComponent';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={
            <LandingPage />
          } />
          <Route path="/peta" element={
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 w-full">
                <MapComponent />
              </div>
            </main>
          } />

          <Route path="/data" element={<div className="p-4 h-full">Halaman Data RTH</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;