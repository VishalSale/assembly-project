const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminUploadCsvController = require('../../controllers/admin/adminUploadCsvController');
const { authenticateToken, systemPermission } = require('../../middleware/authenticateToken');
const { UPLOAD } = require('../../config/constants');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD.UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
    if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype) || 
        UPLOAD.ALLOWED_EXTENSIONS.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: UPLOAD.MAX_FILE_SIZE
    }
});

router.post('/upload-csv', systemPermission, authenticateToken, upload.single('csvFile'), adminUploadCsvController.uploadVoterFile);
router.get('/get-voters', systemPermission, authenticateToken, adminUploadCsvController.getVoterData);

module.exports = router;
