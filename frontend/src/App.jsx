// src/App.jsx
import MapComponent from './components/MapComponent';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Peta Sebaran RTH</h1>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Map section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[70vh] w-full">
          <MapComponent />
        </div>

        {/* Legend section */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Keterangan:</h2>
          <div className="flex flex-wrap gap-6">
            {/* RTH Rendah */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <span>Area RTH Rendah</span>
            </div>

            {/* RTH Sedang */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <span>Area RTH Sedang</span>
            </div>

            {/* RTH Tinggi */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <span>Area RTH Tinggi</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
