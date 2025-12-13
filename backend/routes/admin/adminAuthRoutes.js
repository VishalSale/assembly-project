const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuthController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.post('/login', adminAuthController.login);
router.post('/logout', authenticateToken, adminAuthController.logout);

module.exports = router;
