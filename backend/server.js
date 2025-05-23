// backend/server.js - Updated dengan auth routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const kecamatanRoutes = require('./Routes/kecamatan');
const rthKecamatanRoutes = require('./Routes/rthKecamatan');
const authRoutes = require('./Routes/auth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bandung-gis', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('API untuk SIG Ruang Terbuka Hijau Bandung berjalan');
});

// Existing routes
app.use('/api/kecamatan', kecamatanRoutes);
app.use('/api/rth-kecamatan', rthKecamatanRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));