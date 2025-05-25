const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createInitialAdmin = async () => {
    try {
        // Connect to MongoDB
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bandung-gis';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');

        // Cek apakah sudah ada admin
        const existingAdmin = await Admin.findOne({});
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
        } else {
            throw new Error('Admin creation verification failed');
        }

        console.log('Initial admin created successfully!');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
        process.exit(0);
    }
};

// Jalankan script
createInitialAdmin();