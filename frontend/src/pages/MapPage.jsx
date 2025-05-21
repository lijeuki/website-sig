// src/pages/MapPage.jsx - Updated
import React from 'react';
import BandungMap from '../components/Map';

const MapPage = () => {
    return (
        <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold p-4">Peta Ruang Terbuka Hijau Kota Bandung</h1>
            <div className="flex-1 w-full">
                <BandungMap />
            </div>
        </div>
    );
};  

export default MapPage;