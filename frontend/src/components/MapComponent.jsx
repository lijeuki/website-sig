// src/components/MapComponent.jsx
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Perbaikan ukuran icon marker Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Perbaikan icon Leaflet default
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const mapRef = useRef(null);

    // Koordinat pusat kota Bandung
    const bandungCoordinates = [-6.9175, 107.6191];
    const initialZoom = 13;

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/kecamatan/map-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch map data');
                }
                const result = await response.json();

                if (result.data && Array.isArray(result.data)) {
                    console.log("Map data loaded:", result.data.length, "features");
                    setMapData(result.data);
                } else {
                    console.error("Invalid map data format:", result);
                    throw new Error('Invalid map data format');
                }
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
            // Menampilkan tooltip saat hover
            layer.bindTooltip(feature.properties.NAMOBJ);

            // Event handler ketika polygon diklik
            layer.on({
                click: (e) => {
                    console.log("Feature clicked:", feature.properties);
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
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    // Tambahkan style inline untuk memastikan container memiliki tinggi yang tepat
    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        zIndex: 1
    };

    if (loading) return <div className="flex items-center justify-center h-full">Loading map data...</div>;
    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>;

    return (
        <div className="w-full h-full relative" style={{ minHeight: '600px' }}>
            <MapContainer
                center={bandungCoordinates}
                zoom={initialZoom}
                ref={mapRef}
                style={mapContainerStyle}
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