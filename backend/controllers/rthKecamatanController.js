// backend/controllers/rthKecamatanController.js
const RthKecamatan = require('../models/RthKecamatan');

// Ambil semua data RTH kecamatan
exports.getAllRthKecamatan = async (req, res) => {
    try {
        const data = await RthKecamatan.find({}).sort('kecamatan');
        console.log("Data retrieved from MongoDB:", data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching RTH kecamatan data:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};

// Simpan banyak data RTH kecamatan (dari Excel)
exports.bulkSaveRthKecamatan = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: 'Invalid data format. Expected array of kecamatan data.' });
        }

        console.log("Received data on server:", data);

        // Pastikan semua field numerik diolah dengan benar
        const processedData = data.map(item => ({
            kecamatan: item.kecamatan,
            luas_taman: parseFloat(item.luas_taman) || 0,
            luas_pemakaman: parseFloat(item.luas_pemakaman) || 0,
            total_rth: parseFloat(item.total_rth) || 0,
            luas_kecamatan: parseFloat(item.luas_kecamatan) || 0,
            cluster: item.cluster || 'cluster_0'
        }));

        console.log("Processed data on server:", processedData);

        // Hapus semua data yang ada terlebih dahulu
        await RthKecamatan.deleteMany({});

        // Simpan data baru
        const insertedData = await RthKecamatan.insertMany(processedData);

        res.status(201).json({
            message: `${insertedData.length} data RTH kecamatan berhasil disimpan`,
            count: insertedData.length
        });
    } catch (err) {
        console.error('Error saving RTH kecamatan data:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};

// Tambah satu data RTH kecamatan
exports.addRthKecamatan = async (req, res) => {
    try {
        const newData = new RthKecamatan(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        console.error('Error adding RTH kecamatan data:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};

// Update data RTH kecamatan
exports.updateRthKecamatan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await RthKecamatan.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedData) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json(updatedData);
    } catch (err) {
        console.error('Error updating RTH kecamatan data:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};

// Hapus data RTH kecamatan
exports.deleteRthKecamatan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await RthKecamatan.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting RTH kecamatan data:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};