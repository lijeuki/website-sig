
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createInitialAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bandung-gis');
        console.log('Connected to MongoDB');

     

        // Data admin default
        const adminData = {
            username: 'may',
            password: 'may'
        };

        // Buat admin baru
        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        console.log('Initial admin created successfully!');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
};

// Jalankan script
createInitialAdmin();