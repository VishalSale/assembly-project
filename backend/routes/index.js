const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health');
const searchRoutes = require('./search');
const pdfRoutes = require('./pdf');
const posterRoutes = require('./poster');
const shareRoutes = require('./share');

// Use routes
router.use('/health', healthRoutes);
router.use('/search', searchRoutes);
router.use('/download-pdf', pdfRoutes);
router.use('/poster', posterRoutes);
router.use('/share', shareRoutes);

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
      }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;