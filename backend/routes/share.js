const express = require('express');
const router = express.Router();
const { generateShareImage } = require('../controllers/shareController');
const { systemPermission } = require('../middleware/authenticateToken')

// GET /api/share/:id - Generate and download voter share image
router.get('/:id', systemPermission, generateShareImage);

module.exports = router;