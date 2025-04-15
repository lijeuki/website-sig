// src/App.jsx
import MapComponent from './components/MapComponent';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Peta Sebaran RTH</h1>
      </header>

      <main className="flex-1 p-1">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[70vh] w-full">
          <MapComponent />
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Keterangan:</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <span>Area RTH Rendah</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <span>Area RTH Sedang</span>
            </div>
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