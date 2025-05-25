const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createInitialAdmin = async () => {
    try {
        // Connect to MongoDB
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bandung-gis';
        console.log('MongoDB URI:', uri);
        
        // Force close any existing connection
        if (mongoose.connection.readyState !== 0) {
            console.log('Closing existing connection...');
            await mongoose.connection.close();
        }

        // Ensure we're using the correct database name
        const finalUri = uri.includes('/bandung-gis') ? uri : `${uri}/bandung-gis`;
        console.log('Final MongoDB URI:', finalUri);

        console.log('Connecting to MongoDB...');
        await mongoose.connect(finalUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');
        console.log('Database name:', mongoose.connection.db.databaseName);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // Cek apakah sudah ada admin
        console.log('Checking for existing admin...');
        const existingAdmin = await Admin.findOne({});
        console.log('Existing admin query result:', existingAdmin);

        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.username);
            process.exit(0);
        }

        // Data admin default
        const adminData = {
            username: 'may',
            password: 'may'
        };

        // Buat admin baru
        console.log('Creating new admin...');
        const newAdmin = new Admin(adminData);
        await newAdmin.save();
        console.log('Admin saved to database successfully');

        // Verify admin was created
        const verifyAdmin = await Admin.findOne({ username: adminData.username });
        if (verifyAdmin) {
            console.log('Admin creation verified:', verifyAdmin.username);
            console.log('Admin document:', JSON.stringify(verifyAdmin, null, 2));
        } else {
            throw new Error('Admin creation verification failed');
        }

        console.log('Initial admin created successfully!');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);

    } catch (error) {
        console.error('Error creating admin:', error);
        console.error('Error details:', error.stack);
        process.exit(1);
    } finally {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected');
        } catch (disconnectError) {
            console.error('Error disconnecting:', disconnectError);
        }
        process.exit(0);
    }
};

// Jalankan script
createInitialAdmin();