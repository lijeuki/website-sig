// src/components/MapComponent.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    // Koordinat pusat kota Bandung
    const bandungCoordinates = [-6.9175, 107.6191];
    const initialZoom = 12; // Zoom level yang sesuai untuk melihat kota Bandung

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/kecamatan/map-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch map data');
                }
                const result = await response.json();
                setMapData(result.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching map data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, []);

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            // Menampilkan popup saat hover
            layer.bindTooltip(feature.properties.NAMOBJ);

            // Event handler ketika polygon diklik
            layer.on({
                click: (e) => {
                    setSelectedArea({
                        name: feature.properties.NAMOBJ,
                        area: feature.properties.luasRTH,
                        color: feature.properties.warna
                    });

                    // Styling saat area diklik
                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                }
            });
        }
    };

    const styleFunction = (feature) => {
        return {
            fillColor: feature.properties.warna || '#3388ff',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.7
        };
    };

    if (loading) return <div className="text-center py-10">Loading map data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={bandungCoordinates}
                zoom={initialZoom}
                style={{ height: '100%', width: '100%' }}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapData.length > 0 && (
                    <GeoJSON
                        data={{
                            type: "FeatureCollection",
                            features: mapData
                        }}
                        style={styleFunction}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>

            {selectedArea && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
                    <h3 className="text-lg font-bold mb-2">{selectedArea.name}</h3>
                    <p className="mb-2">Luas RTH: {selectedArea.area.toFixed(2)} m²</p>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedArea.color }}></div>
                        <span className="text-sm">
                            {selectedArea.color === '#4CAF50' ? 'RTH Tinggi' :
                                selectedArea.color === '#FFC107' ? 'RTH Sedang' : 'RTH Rendah'}
                        </span>
                    </div>
                    <button
                        className="mt-3 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        onClick={() => setSelectedArea(null)}
                    >
                        Tutup
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;