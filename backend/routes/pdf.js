const express = require('express');
const router = express.Router();
const { generateVoterPdf } = require('../controllers/pdfController');
const { systemPermission } = require('../middleware/authenticateToken')

// GET /api/download-pdf/:id - Generate and download voter PDF
router.get('/:id', systemPermission, generateVoterPdf);

module.exports = router;