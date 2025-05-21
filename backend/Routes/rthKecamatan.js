// backend/Routes/rthKecamatan.js
const express = require('express');
const router = express.Router();
const rthKecamatanController = require('../controllers/rthKecamatanController');

// Get semua data
router.get('/', rthKecamatanController.getAllRthKecamatan);

// Simpan banyak data (untuk upload Excel)
router.post('/bulk', rthKecamatanController.bulkSaveRthKecamatan);

// Tambah satu data
router.post('/', rthKecamatanController.addRthKecamatan);

// Update data
router.put('/:id', rthKecamatanController.updateRthKecamatan);

// Hapus data
router.delete('/:id', rthKecamatanController.deleteRthKecamatan);

module.exports = router;