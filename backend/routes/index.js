const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health');
const searchRoutes = require('./search');
const pdfRoutes = require('./pdf');
const posterRoutes = require('./poster');
const shareRoutes = require('./share');

// ADMIN
const adminAuth = require('./admin/adminAuthRoutes');
const adminUploadCsv = require('./admin/adminUploadCsvRoutes');

// Use routes
router.use('/health', healthRoutes);
router.use('/search', searchRoutes);
router.use('/download-pdf', pdfRoutes);
router.use('/poster', posterRoutes);
router.use('/share', shareRoutes);

// ADMIN
router.use('/admin/auth', adminAuth);
router.use('/admin', adminUploadCsv);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Kagal Voter Information API',
    version: process.env.APP_VERSION || '1.0.0',
    endpoints: [
      {
        path: '/health',
        method: 'GET',
        description: 'System health check'
      },
      {
        path: '/search',
        method: 'POST',
        description: 'Search voters by various criteria'
      },
      {
        path: '/download-pdf/:id',
        method: 'GET',
        description: 'Download voter information as PDF'
      },
      {
        path: '/poster',
        method: 'GET',
        description: 'Get poster image information'
      },
      {
        path: '/share/:id',
        method: 'GET',
        description: 'Generate voter share image'
      },
      {
        path: '/admin/auth/login',
        method: 'POST',
        description: 'Admin login'
      },
      {
        path: '/admin/auth/logout',
        method: 'POST',
        description: 'Admin logout (requires auth)'
      },
      {
        path: '/admin/upload-csv',
        method: 'POST',
        description: 'Upload CSV file (requires auth)'
      },
      {
        path: '/admin/get-voters',
        method: 'GET',
        description: 'Get voter data (requires auth)'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;