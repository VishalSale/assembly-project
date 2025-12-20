const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminUploadCsvController = require('../../controllers/admin/adminUploadCsvController');
const { authenticateToken, systemPermission } = require('../../middleware/authenticateToken');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.post('/upload-csv', systemPermission, authenticateToken, upload.single('csvFile'), adminUploadCsvController.uploadVoterFile);
router.get('/get-voters', systemPermission, authenticateToken, adminUploadCsvController.getVoterData);

module.exports = router;
