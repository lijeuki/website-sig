const mongoose = require('mongoose');

const KecamatanSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Feature'],
        required: true
    },
    properties: {
        OBJECTID: Number,
        NAMOBJ: { type: String, index: true },
        WADMKC: String,
        WADMKD: String,
        WADMKK: String,
        WADMPR: String,
        FCODE: String,
        LUASWH: Number,
        Shape_Area: Number,
        luasRTH: { type: Number, default: 0 },
        warna: { type: String, default: '#3388ff' }
    },
    geometry: {
        type: {
            type: String,
            enum: ['Polygon', 'MultiPolygon'],
            required: true
        },
        coordinates: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }
}, { collection: 'kecamatan' });

// Index untuk query geospasial
KecamatanSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Kecamatan', KecamatanSchema);