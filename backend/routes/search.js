const express = require('express');
const router = express.Router();
const { searchVoters } = require('../controllers/searchController');
const { systemPermission } = require('../middleware/authenticateToken')

// Search voters - Support both GET and POST
router.get('/', systemPermission, searchVoters);
router.post('/', systemPermission, searchVoters);

module.exports = router;