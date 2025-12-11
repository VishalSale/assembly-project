const express = require('express');
const router = express.Router();
const { generateVoterPdf } = require('../controllers/pdfController');

// GET /api/download-pdf/:id - Generate and download voter PDF
router.get('/:id', generateVoterPdf);

module.exports = router;