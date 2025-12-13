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

    // Check if poster image exists
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    let posterBase64 = '';
    
    for (const ext of imageExtensions) {
      const testPath = path.join(__dirname, `../images/poster.${ext}`);
      if (fs.existsSync(testPath)) {
        const posterBuffer = fs.readFileSync(testPath);
        const mimeType = ext === 'jpg' ? 'jpeg' : ext;
        posterBase64 = `data:image/${mimeType};base64,${posterBuffer.toString('base64')}`;
        break;
      }
    }

    // Create slip format HTML template for sharing
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background: white;
                padding: 0;
                margin: 0;
                color: black;
            }
            
            .voter-slip {
                width: 100%;
                background: white;
                border: 2px solid black;
                overflow: hidden;
                margin: 0;
            }
            
            .poster-section {
                width: 100%;
                height: 100px;
                overflow: hidden;
            }
            
            .poster-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            
            .content-section {
                background: white;
            }
            
            .row {
                display: flex;
                border-bottom: 2px solid black;
            }
            
            .cell {
                padding: 8px;
                border-right: 2px solid black;
                flex: 1;
                background: white;
            }
            
            .cell:last-child {
                border-right: none;
            }
            
            .full-width {
                flex: 1;
                padding: 8px;
                border-bottom: 2px solid black;
                background: white;
            }
            
            .label {
                font-size: 12px;
                font-weight: normal;
                color: black;
                margin-bottom: 4px;
            }
            
            .value {
                font-size: 16px;
                font-weight: bold;
                color: black;
                text-transform: uppercase;
            }
            
            .name-value {
                font-size: 18px;
                font-weight: bold;
                color: black;
                text-transform: uppercase;
            }
            
            .footer {
                text-align: center;
                padding: 10px;
                background: white;
                font-size: 12px;
                color: black;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="voter-slip">
            ${posterBase64 ? `
            <div class="poster-section">
                <img src="${posterBase64}" alt="Poster" class="poster-image" />
            </div>
            ` : ''}
            
            <div class="content-section">
                <!-- Part No and Serial No -->
                <div class="row">
                    <div class="cell">
                        <div class="label">यादी भाग (Part No)</div>
                        <div class="value">${voter.Part || 'N/A'}</div>
                    </div>
                    <div class="cell">
                        <div class="label">अनुक्रमांक (Serial No)</div>
                        <div class="value">${voter['Serial No'] || 'N/A'}</div>
                    </div>
                </div>
                
                <!-- Name -->
                <div class="full-width">
                    <div class="label">नाव (Name):</div>
                    <div class="name-value">${(firstNameEng + ' ' + middleNameEng + ' ' + surnameEng).trim()}</div>
                </div>
                
                <!-- EPIC Number -->
                <div class="full-width">
                    <div class="label">EPIC क्रमांक (EPIC No):</div>
                    <div class="name-value">${voter['EPIC No'] || voter.EPIC || 'N/A'}</div>
                </div>
                
                <!-- Age and Gender -->
                <div class="row">
                    <div class="cell">
                        <div class="label">वय (Age):</div>
                        <div class="value">${voter.Age || '32'}</div>
                    </div>
                    <div class="cell">
                        <div class="label">लिंग (Gender):</div>
                        <div class="value">${voter.Gender || 'Female'}</div>
                    </div>
                </div>
                
                <!-- Address -->
                <div class="full-width">
                    <div class="label">पत्ता (Address):</div>
                    <div class="value">${voter.Address || 'Market Yard, House No 926, Chawl D'}</div>
                </div>
                
                <!-- Polling Station -->
                <div class="full-width">
                    <div class="label">मतदान केंद्राचे नाव व पत्ता:</div>
                    <div class="value">${voter['Booth Name'] || 'Govt High School South Wing'}</div>
                </div>
                
                <!-- Voting Time -->
                <div class="footer">
                    मतदानाची वेळ: सकाळी ७.३० ते सायं ५.३०
                </div>
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
    await page.setViewport({ width: 500, height: 700, deviceScaleFactor: 2 });
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and images to load
    await page.waitForTimeout(1000);
    
    // Get the actual content height to avoid extra space
    const contentHeight = await page.evaluate(() => {
      return document.querySelector('.voter-slip').offsetHeight;
    });
    
    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 500,
        height: Math.min(contentHeight + 10, 600) // Add small buffer but cap at 600px
      }
    });

    await browser.close();

    // Set response headers for image
    const filename = `voter_slip_${id}_${firstNameEng}_${surnameEng}.png`.replace(/\s+/g, '_');
    
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