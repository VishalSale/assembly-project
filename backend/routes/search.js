const express = require('express');
const router = express.Router();
const { searchVoters } = require('../controllers/searchController');

// POST /api/search - Search voters
router.post('/', searchVoters);

module.exports = router;