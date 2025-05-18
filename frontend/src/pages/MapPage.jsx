// src/pages/MapPage.jsx
import React from 'react';
import BandungMap from '../components/Map';

const MapPage = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Peta Ruang Terbuka Hijau Kota Bandung</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-full w-full">
                    <BandungMap />
                </div>
            </div>
        </div>
    );
};

export default MapPage;