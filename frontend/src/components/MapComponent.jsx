import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const selectedLayerRef = useRef(null);

    const bandungCoordinates = [-6.9175, 107.6191];
    const initialZoom = 12;

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/kecamatan/map-data');
                if (!response.ok) throw new Error('Failed to fetch map data');
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

    const defaultStyle = (feature) => ({
        fillColor: feature.properties.warna || '#3388ff',
        weight: 2,
        opacity: 0.7,
        color: 'white',       // Border putih
        stroke: true,         // pastikan ada stroke
        dashArray: '1',
        fillOpacity: 0.7,
    });

    const highlightStyle = (feature) => ({
        fillColor: feature.properties.warna || '#3388ff',
        weight: 2,
        opacity: 1,
        color: '#ffffff',     // Tetap putih agar tidak hitam
        stroke: true,
        dashArray: '',
        fillOpacity: 0.9,
    });

    const resetLayerStyle = (layer) => {
        if (layer && layer.setStyle) {
            layer.setStyle(defaultStyle(layer.feature));
        }
    };

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            layer.bindTooltip(feature.properties.NAMOBJ);

            layer.on({
                click: () => {
                    // Reset layer sebelumnya
                    if (selectedLayerRef.current) {
                        resetLayerStyle(selectedLayerRef.current);
                    }

                    // Set style baru & simpan layer yang aktif
                    layer.setStyle(highlightStyle(feature));
                    selectedLayerRef.current = layer;

                    setSelectedArea({
                        name: feature.properties.NAMOBJ,
                        area: feature.properties.luasRTH,
                        color: feature.properties.warna,
                    });
                },
            });
        }
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
                        data={{ type: "FeatureCollection", features: mapData }}
                        style={defaultStyle}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>

            {selectedArea && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
                    <h3 className="text-lg font-bold mb-2">Kecamatan {selectedArea.name}</h3>
                    <p className="mb-2">
                        Luas RTH: {selectedArea.area.toFixed(2)} m²
                    </p>
                    <button
                        className="mt-3 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        onClick={() => {
                            if (selectedLayerRef.current) {
                                resetLayerStyle(selectedLayerRef.current);
                            }
                            setSelectedArea(null);
                        }}
                    >
                        Tutup
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
