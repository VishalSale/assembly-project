const express = require('express');
const router = express.Router();
const { searchVoters } = require('../controllers/searchController');

// Search voters - Support both GET and POST
router.get('/', searchVoters);
router.post('/', searchVoters);

module.exports = router;