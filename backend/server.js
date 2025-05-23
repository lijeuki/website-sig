// backend/server.js - Updated untuk serverless environment
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

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
    w: 'majority'
};

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        
        // Check if we're already connected
        if (mongoose.connection.readyState === 1) {
            return;
        }
        
        // Close any existing connection before creating a new one
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        
        await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // In serverless environment, we don't want to retry indefinitely
        if (process.env.NODE_ENV === 'production') {
            throw err;
        }
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection - only in development
if (process.env.NODE_ENV !== 'production') {
    connectWithRetry();
}

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    if (process.env.NODE_ENV !== 'production') {
        connectWithRetry();
    }
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

// Health check endpoint
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Test MongoDB connection endpoint
app.get('/testconnection', async (req, res) => {
    try {
        // Check current connection state
        const currentState = mongoose.connection.readyState;
        const stateMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // Try to ping the database
        let pingResult = null;
        if (currentState === 1) {
            pingResult = await mongoose.connection.db.admin().ping();
        }

        // Get connection details
        const connectionDetails = {
            state: stateMap[currentState] || 'unknown',
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            port: mongoose.connection.port,
            ping: pingResult ? 'success' : 'not attempted'
        };

        res.status(200).json({
            success: true,
            message: 'Connection test completed',
            connection: connectionDetails,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Connection test error:', error);
        res.status(500).json({
            success: false,
            message: 'Connection test failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
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
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for serverless
module.exports = app;