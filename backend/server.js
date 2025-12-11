require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Import database connection
const { testConnection } = require('./config/database');

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with CORS headers
app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('images'));

// Routes
app.use('/api', require('./routes/index'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test poster endpoint
app.get('/test-poster', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const foundImages = [];
  
  for (const ext of imageExtensions) {
    const posterPath = path.join(__dirname, `images/poster.${ext}`);
    if (fs.existsSync(posterPath)) {
      foundImages.push({
        extension: ext,
        path: posterPath,
        url: `/images/poster.${ext}`,
        size: fs.statSync(posterPath).size
      });
    }
  }
  
  res.json({
    found: foundImages,
    staticPath: path.join(__dirname, 'images'),
    currentDir: __dirname
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /health',
      'GET /api/health',
      'POST /api/search',
      'GET /api/download-pdf/:id'
    ]
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Kagal Voter API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Test database connection
  await testConnection();
});