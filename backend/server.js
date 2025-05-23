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
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
    w: 'majority',
    family: 4, // Force IPv4
    appName: 'bandung-gis-backend' // Add app name for better monitoring
};

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        // Force close any existing connection and wait
        if (mongoose.connection.readyState !== 0) {
            console.log('Closing existing connection...');
            await mongoose.connection.close();
            // Wait longer for the connection to fully close
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Clear any existing connection and listeners
        mongoose.connection.removeAllListeners();
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Create new connection with explicit database name
        const uri = process.env.MONGO_URI.endsWith('/') 
            ? `${process.env.MONGO_URI}bandung-gis` 
            : `${process.env.MONGO_URI}/bandung-gis`;
            
        console.log('Connecting to MongoDB...', uri);
        
        // Disconnect first to ensure clean state
        await mongoose.disconnect();
        
        // Create new connection
        await mongoose.connect(uri, {
            ...mongoOptions,
            serverSelectionTimeoutMS: 5000, // Shorter timeout for faster failure
            connectTimeoutMS: 5000
        });
        
        console.log('MongoDB connected successfully');
        
        // Verify connection with ping
        const pingResult = await mongoose.connection.db.admin().ping();
        console.log('MongoDB ping successful:', pingResult);
        
        return true;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Ensure we're disconnected on error
        try {
            await mongoose.disconnect();
        } catch (disconnectErr) {
            console.error('Error disconnecting:', disconnectErr);
        }
        throw err;
    }
};

// Middleware to ensure MongoDB connection
const ensureMongoConnection = async (req, res, next) => {
    try {
        // Always try to connect in serverless environment
        console.log('Current connection state:', mongoose.connection.readyState);
        await connectWithRetry();
        next();
    } catch (error) {
        console.error('MongoDB connection middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            state: mongoose.connection.readyState,
            timestamp: new Date().toISOString()
        });
    }
};

// Apply the middleware to all routes
app.use(ensureMongoConnection);

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
        // Force a new connection attempt
        console.log('Testing connection...');
        await connectWithRetry();
        
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
        try {
            pingResult = await mongoose.connection.db.admin().ping();
            console.log('Ping result:', pingResult);
        } catch (pingError) {
            console.error('Ping error:', pingError);
        }

        // Get connection details
        const connectionDetails = {
            state: stateMap[currentState] || 'unknown',
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            port: mongoose.connection.port,
            ping: pingResult ? 'success' : 'failed',
            uri: process.env.MONGO_URI ? 'configured' : 'not configured',
            readyState: currentState,
            database: mongoose.connection.db.databaseName
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
            state: mongoose.connection.readyState,
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