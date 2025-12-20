const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuthController');
const { authenticateToken, systemPermission } = require('../../middleware/authenticateToken');

router.post('/login', systemPermission, adminAuthController.login);
router.post('/logout', systemPermission, authenticateToken, adminAuthController.logout);

module.exports = router;
