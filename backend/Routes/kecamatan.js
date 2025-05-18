const express = require('express');
const router = express.Router();
const kecamatanController = require('../controllers/kecamatanController');

// Route untuk mendapatkan data kecamatan
router.get('/', kecamatanController.getKecamatan);

module.exports = router;