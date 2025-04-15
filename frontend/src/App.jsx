// src/App.jsx
import MapComponent from './components/MapComponent';
import './App.css';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="bg-blue-600 text-white p-2 shadow-md">
        <h1 className="text-xl font-bold text-center">Peta Sebaran RTH</h1>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 w-full">
          <MapComponent />
        </div>

        <div className="bg-white p-2 shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">RTH Rendah</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">RTH Sedang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">RTH Tinggi</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;