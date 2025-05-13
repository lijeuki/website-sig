// backend/Routes/csvData.js - Emergency Fix
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET semua data CSV - versi darurat
router.get('/', async (req, res) => {
    try {
        console.log('GET request received for /api/csvdata');

        // Gunakan koneksi native MongoDB untuk mendapatkan data mentah
        const db = mongoose.connection.db;
        const collection = db.collection('data');
        const data = await collection.find({}).toArray();

        console.log(`Found ${data.length} RTH data records`);

        // Debug output
        if (data.length > 0) {
            console.log('Sample document:', JSON.stringify(data[0]));
        }

        // Kirim array data mentah
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error('Error in /csvdata endpoint:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;