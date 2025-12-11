const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Test database connection
    try {
      await db.raw('SELECT 1');
      health.database = 'connected';
      
      // Check if voters table exists and count records
      const tableExists = await db.schema.hasTable('kagal_data');
      if (tableExists) {
        const count = await db('kagal_data').count('id as total').first();
        health.votersCount = parseInt(count.total);
        health.table = 'exists';
      } else {
        health.table = 'missing';
        health.status = 'warning';
      }
    } catch (dbError) {
      health.database = 'disconnected';
      health.status = 'error';
      health.dbError = dbError.message;
    }

    // Check Puppeteer availability
    try {
      const puppeteer = require('puppeteer');
      health.pdfGenerator = 'puppeteer available';
    } catch (pdfError) {
      health.pdfGenerator = 'puppeteer missing';
      health.status = 'warning';
    }

    const statusCode = health.status === 'error' ? 503 : 200;
    res.status(statusCode).json(health);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;