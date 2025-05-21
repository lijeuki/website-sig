// src/components/Map.jsx - Modified version
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const BandungMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fix Leaflet icon issues
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: icon,
            iconRetinaUrl: iconRetina,
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
    }, []);

    useEffect(() => {
        const fetchKecamatan = async () => {
            try {
                console.log('Fetching kecamatan data...');
                const res = await axios.get('http://localhost:5000/api/kecamatan');
                console.log('Data received:', res.data);
                setGeoData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching kecamatan data:', err);
                setError('Failed to load kecamatan data: ' + err.message);
                setLoading(false);
            }
        };

        fetchKecamatan();
    }, []);

    const mapStyle = {
        fillColor: '#3388ff',
        weight: 0.8,
        opacity: 1,
        color: '#333',
        dashArray: '0.5',
        fillOpacity: 0.4
    };

    // Fungsi untuk event kecamatan
    const onEachFeature = (feature, layer) => {
        // Menambahkan tooltip untuk hover
        if (feature.properties && feature.properties.name) {
            layer.bindTooltip(feature.properties.name);
        }

        // Menambahkan popup untuk klik
        const popupContent = feature.properties && feature.properties.name
            ? `<div>
          <h3 class="font-semibold text-lg">${feature.properties.name}</h3>
        </div>`
            : 'Kecamatan tidak diketahui';

        layer.bindPopup(popupContent);

        // Tambahkan event handler untuk highlight saat hover
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                layer.bringToFront();
            },
            mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(mapStyle);
            },
            click: (e) => {
                const layer = e.target;
                // Popup already taken care of by bindPopup above
                console.log(`Clicked on: ${feature.properties.name || 'Unknown'}`);
            }
        });
    };

    if (loading) return <div className="flex justify-center items-center h-full">Loading map data...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    console.log('Rendering map with data:', geoData);

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[-6.9147, 107.6098]}
                zoom={12.4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={() => mapStyle}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default BandungMap;