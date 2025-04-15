const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Kecamatan = require('../models/Kecamatan');

// 1. Setup File Upload dengan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `geojson-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /geojson|json/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file GeoJSON (.geojson/.json) yang diperbolehkan'));
        }
    },
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Fungsi untuk membersihkan dan validasi GeoJSON
const cleanAndValidateGeoJSON = (feature) => {
    // Pastikan properti NAMOBJ ada (handle case sensitive)
    const properties = {
        NAMOBJ: feature.properties.NAMOBJ || feature.properties.NANOBJ || 'Unknown',
        luasRTH: feature.properties.luasRTH || feature.properties.IuasRTH || 0,
        warna: feature.properties.warna || '#3388ff'
    };

    // Bersihkan koordinat (hilangkan nilai Z jika ada)
    const cleanCoordinates = (coords) => {
        if (!Array.isArray(coords)) return coords;
        return coords.map(coord => {
            if (Array.isArray(coord[0])) {
                return cleanCoordinates(coord); // Rekursif untuk nested arrays
            }
            return coord.slice(0, 2); // Ambil hanya longitude dan latitude
        });
    };

    return {
        type: "Feature",
        properties,
        geometry: {
            type: feature.geometry.type,
            coordinates: cleanCoordinates(feature.geometry.coordinates)
        }
    };
};

// 2. Endpoint Import GeoJSON
router.post('/import', upload.single('geojsonFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada file yang diupload'
            });
        }

        const rawData = fs.readFileSync(req.file.path);
        const geojson = JSON.parse(rawData);

        if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Format GeoJSON tidak valid. File harus memiliki type: "FeatureCollection" dan array features'
            });
        }

        // Bersihkan dan validasi setiap feature
        const featuresToInsert = geojson.features.map(feature => {
            try {
                return cleanAndValidateGeoJSON(feature);
            } catch (error) {
                console.error('Error processing feature:', feature);
                throw new Error(`Invalid feature: ${error.message}`);
            }
        });

        await Kecamatan.deleteMany({});
        const result = await Kecamatan.insertMany(featuresToInsert);
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `Berhasil mengimport ${result.length} data kecamatan`,
            data: result
        });

    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({
            success: false,
            message: 'Gagal memproses file',
            error: err.message
        });
    }
});

// 3. Endpoint Get All Data
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await Kecamatan.find()
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            success: true,
            total: await Kecamatan.countDocuments(),
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// 4. Endpoint Get Nama Kecamatan
router.get('/list', async (req, res) => {
    try {
        const data = await Kecamatan.find({}, { 'properties.NAMOBJ': 1, _id: 0 });
        res.json({
            success: true,
            data: data.map(item => item.properties.NAMOBJ)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// 5. Endpoint Analisis RTH
router.patch('/analyze-rth', async (req, res) => {
    try {
        const allKecamatan = await Kecamatan.find();

        const updateOps = allKecamatan.map(kec => {
            const luasArea = kec.properties.Shape_Area || 0;
            let warna = '#FF0000'; // Merah default

            if (luasArea > 0.0002) warna = '#4CAF50'; // Hijau
            else if (luasArea > 0.0001) warna = '#FFC107'; // Kuning

            return {
                updateOne: {
                    filter: { _id: kec._id },
                    update: {
                        $set: {
                            'properties.luasRTH': luasArea * 10000,
                            'properties.warna': warna
                        }
                    }
                }
            };
        });

        await Kecamatan.bulkWrite(updateOps);
        res.json({
            success: true,
            message: `Updated ${updateOps.length} kecamatan`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// 6. Endpoint Data untuk Peta (Fixed)
router.get('/map-data', async (req, res) => {
    try {
        const data = await Kecamatan.find({}, {
            'properties.NAMOBJ': 1,
            'properties.luasRTH': 1,
            'properties.warna': 1,
            'geometry': 1,
            '_id': 0
        });

        // Bersihkan data sebelum dikirim
        const cleanedData = data.map(item => {
            const properties = {
                NAMOBJ: item.properties.NAMOBJ || 'Unknown',
                luasRTH: item.properties.luasRTH || 0,
                warna: item.properties.warna || '#3388ff'
            };

            // Pastikan koordinat valid
            const cleanCoordinates = (coords) => {
                if (!Array.isArray(coords)) return [];
                return coords.map(coord => {
                    if (Array.isArray(coord[0])) {
                        return cleanCoordinates(coord); // Rekursif untuk nested arrays
                    }
                    return coord.slice(0, 2); // Ambil hanya longitude dan latitude
                });
            };

            return {
                type: "Feature",
                properties,
                geometry: {
                    type: item.geometry.type,
                    coordinates: cleanCoordinates(item.geometry.coordinates)
                }
            };
        });

        res.json({
            success: true,
            data: cleanedData
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;