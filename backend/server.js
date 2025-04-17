// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const kecamatanRoutes = require('./routes/kecamatan');

// Inisialisasi Aplikasi Express
const app = express();

// 1. Konfigurasi Dasar
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rth-bandung';

// 2. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Buat Folder Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 4. Koneksi Database
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 5. Routes
app.use('/api/kecamatan', kecamatanRoutes);

// 6. Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle Multer Errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }

    // Handle Other Errors
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

// 7. Static Files (Untuk development)
if (process.env.NODE_ENV === 'development') {
    app.use('/uploads', express.static(uploadDir));
}

// 8. Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Import GeoJSON via POST to http://localhost:${PORT}/api/kecamatan/import`);
});