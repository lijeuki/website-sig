// src/App.jsx
import MapComponent from './components/MapComponent';
import DataDisplay from './components/DataDisplay';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen overflow-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/peta" element={
            <div className="flex-1 w-full h-full flex flex-col relative">
              <MapComponent />
            </div>
          } />
          <Route path="/data" element={
            <div className="flex-1 w-full h-full overflow-auto">
              <DataDisplay />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;