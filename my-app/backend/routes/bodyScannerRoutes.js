const express = require('express');
const router = express.Router();
const bodyScannerController = require('../controllers/bodyScannerController');

router.post('/', bodyScannerController.scanBody);  // Post to scan body

module.exports = router;
