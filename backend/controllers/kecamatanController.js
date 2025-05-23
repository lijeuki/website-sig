const Kecamatan = require('../models/Kecamatan');

exports.getKecamatan = async (req, res) => {
    try {
        console.log('Fetching kecamatan data from MongoDB');

        // Ambil data mentah dari MongoDB
        const kecamatanData = await Kecamatan.find({}).lean();

        console.log(`Found ${kecamatanData.length} kecamatan documents`);

        // Log struktur dokumen pertama untuk debugging
        if (kecamatanData.length > 0) {
            console.log('First document structure:',
                JSON.stringify(Object.keys(kecamatanData[0])));
        }

        // Jika tidak ada data, kembalikan FeatureCollection kosong
        if (!kecamatanData || kecamatanData.length === 0) {
            return res.json({
                type: 'FeatureCollection',
                features: []
            });
        }

        // Ambil dokumen pertama (seharusnya hanya ada satu dokumen FeatureCollection)
        const geoJsonData = kecamatanData[0];

        // Pastikan data memiliki struktur yang benar
        if (!geoJsonData.type || geoJsonData.type !== 'FeatureCollection' || !Array.isArray(geoJsonData.features)) {
            console.error('Invalid GeoJSON structure:', geoJsonData);
            return res.status(500).json({
                message: 'Invalid GeoJSON structure in database'
            });
        }

        console.log(`Returning ${geoJsonData.features.length} GeoJSON features`);
        
        // Log contoh feature pertama jika ada
        if (geoJsonData.features.length > 0) {
            console.log('Sample feature:',
                JSON.stringify(geoJsonData.features[0].properties));
        }

        res.json(geoJsonData);
    } catch (err) {
        console.error('Error in getKecamatan:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};