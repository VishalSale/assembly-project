const validator = require('validator');
const { db } = require('../config/database');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Generate share image for voter information
const generateShareImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate voter ID
    if (!id || !validator.isInt(id.toString())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid voter ID'
      });
    }

    // Fetch voter data from database
    const voter = await db('kagal_data')
      .where('id', id)
      .first();

    if (!voter) {
      return res.status(404).json({
        success: false,
        error: 'Voter not found'
      });
    }

    // Parse names
    const englishNameParts = (voter.EFullName || '').split(' ');
    const firstNameEng = englishNameParts[0] || '';
    const middleNameEng = englishNameParts[1] || '';
    const surnameEng = englishNameParts.slice(2).join(' ') || '';
    
    const marathiNameParts = (voter.MFullName || '').split(' ');
    const firstName = marathiNameParts[0] || '';
    const middleName = marathiNameParts[1] || '';
    const surname = marathiNameParts.slice(2).join(' ') || '';

    // Check if poster image exists (support multiple formats)
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    let posterPath = '';
    let posterExists = false;
    let mimeType = '';
    
    for (const ext of imageExtensions) {
      const testPath = path.join(__dirname, `../images/poster.${ext}`);
      if (fs.existsSync(testPath)) {
        posterPath = testPath;
        posterExists = true;
        mimeType = ext === 'jpg' ? 'jpeg' : ext;
        break;
      }
    }
    
    let posterBase64 = '';
    if (posterExists) {
      const posterBuffer = fs.readFileSync(posterPath);
      posterBase64 = `data:image/${mimeType};base64,${posterBuffer.toString('base64')}`;
    }

    // Create HTML template for share image
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 800px;
                height: 600px;
                overflow: hidden;
                box-sizing: border-box;
            }
            .container {
                background: white;
                margin: 20px;
                border-radius: 20px;
                padding: 25px;
                width: 750px;
                height: 550px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                box-sizing: border-box;
            }
            ${posterExists ? `
            .poster-section {
                text-align: center;
                margin-bottom: 15px;
                height: 100px;
                overflow: hidden;
            }
            .poster-image {
                width: 100%;
                height: 100px;
                object-fit: cover;
                border-radius: 12px;
                border: 2px solid #667eea;
            }
            ` : ''}
            .header {
                text-align: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #667eea;
            }
            .title {
                font-size: 20px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 3px;
            }
            .subtitle {
                font-size: 14px;
                color: #4a5568;
            }
            .voter-name {
                text-align: center;
                margin-bottom: 15px;
                padding: 12px;
                background: linear-gradient(135deg, #f8f9ff, #e8eaff);
                border-radius: 12px;
                border: 2px solid #667eea;
            }
            .name-eng {
                font-size: 22px;
                font-weight: bold;
                color: #2d3748;
                margin-bottom: 3px;
            }
            .name-marathi {
                font-size: 18px;
                color: #4a5568;
            }
            .voter-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                flex: 1;
                min-height: 0;
            }
            .detail-section {
                background: #f8f9ff;
                padding: 12px;
                border-radius: 10px;
                border: 1px solid #e1e5fe;
                display: flex;
                flex-direction: column;
            }
            .section-title {
                font-size: 14px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 8px;
                text-transform: uppercase;
                border-bottom: 1px solid #667eea;
                padding-bottom: 3px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                padding: 3px 0;
                border-bottom: 1px solid rgba(102, 126, 234, 0.1);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .label {
                font-weight: bold;
                color: #4a5568;
                font-size: 12px;
            }
            .value {
                color: #2d3748;
                font-size: 12px;
                font-weight: 500;
                text-align: right;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .footer {
                text-align: center;
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px solid #e1e5fe;
                color: #667eea;
                font-weight: bold;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${posterExists ? `
            <div class="poster-section">
                <img src="${posterBase64}" alt="Poster" class="poster-image" />
            </div>
            ` : ''}
            
            <div class="header">
                <div class="title">कागल विधान सभा मतदार माहिती</div>
                <div class="subtitle">Kagal Assembly Constituency - 2024</div>
            </div>

            <div class="voter-name">
                <div class="name-eng">${firstNameEng} ${middleNameEng} ${surnameEng}</div>
                <div class="name-marathi">${firstName} ${middleName} ${surname}</div>
            </div>

            <div class="voter-details">
                <div class="detail-section">
                    <div class="section-title">Personal Info</div>
                    <div class="detail-row">
                        <span class="label">EPIC:</span>
                        <span class="value">${voter.EPIC || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Age:</span>
                        <span class="value">${voter.Age || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Mobile:</span>
                        <span class="value">${voter['Mobile No'] || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Gender:</span>
                        <span class="value">${voter.Gender || 'N/A'}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <div class="section-title">Voting Info</div>
                    <div class="detail-row">
                        <span class="label">Serial No:</span>
                        <span class="value">${voter['Serial No'] || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Booth No:</span>
                        <span class="value">${voter['Booth No'] || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Part:</span>
                        <span class="value">${voter.Part || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Address:</span>
                        <span class="value">${(voter.Address || 'N/A').substring(0, 20)}${voter.Address && voter.Address.length > 20 ? '...' : ''}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                Kagal Voter Information System - 2024
            </div>
        </div>
    </body>
    </html>
    `;

    // Generate image using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    // Wait a bit for fonts and images to load
    await page.waitForTimeout(1000);
    
    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 800,
        height: 600
      }
    });

    await browser.close();

    // Set response headers for image download
    const filename = `voter_${id}_${firstNameEng}_${surnameEng}.png`.replace(/\s+/g, '_');
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', imageBuffer.length);

    // Send image buffer
    res.send(imageBuffer);

  } catch (error) {
    console.error('Share image generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate share image'
    });
  }
};

module.exports = {
  generateShareImage
};