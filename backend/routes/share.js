const express = require('express');
const router = express.Router();
const { generateShareImage } = require('../controllers/shareController');

// GET /api/share/:id - Generate and download voter share image
router.get('/:id', generateShareImage);

module.exports = router;