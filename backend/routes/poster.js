const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// GET /api/poster - Get poster image info
router.get('/', (req, res) => {
  try {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    for (const ext of imageExtensions) {
      const posterPath = path.join(__dirname, `../images/poster.${ext}`);
      if (fs.existsSync(posterPath)) {
        return res.json({
          success: true,
          exists: true,
          url: `/images/poster.${ext}`,
          extension: ext
        });
      }
    }
    
    res.json({
      success: true,
      exists: false,
      url: null,
      extension: null
    });
    
  } catch (error) {
    console.error('Poster check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check poster'
    });
  }
});

module.exports = router;