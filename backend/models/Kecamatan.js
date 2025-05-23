const mongoose = require('mongoose');

// Skema GeoJSON untuk Feature
const FeatureSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Feature'],
        required: true
    },
    properties: {
        NAMEOBJ: String,
        WADMKC: String,
        OBJECTID: Number,
        FCODE: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['MultiPolygon', 'Polygon'],
            required: true
        },
        coordinates: {
            type: [[[[Number]]]],  // Format untuk MultiPolygon
            required: true
        }
    }
});

// Skema untuk Kecamatan
const KecamatanSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['FeatureCollection'],
        required: true
    },
    features: [FeatureSchema]
}, { strict: false });

module.exports = mongoose.model('Kecamatan', KecamatanSchema, 'kecamatan');