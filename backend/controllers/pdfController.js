const validator = require('validator');
const { db } = require('../config/database');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Generate PDF for voter information
const generateVoterPdf = async (req, res) => {
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

    // Create HTML template for PDF
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Voter Information - ${firstNameEng} ${middleNameEng} ${surnameEng}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.4;
                background: white;
            }
            .container {
                background: white;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            .poster-header {
                text-align: center;
                margin-bottom: 20px;
                padding: 0;
                height: 45vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .poster-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0;
                box-shadow: none;
                border: none;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #667eea;
                padding: 15px 20px;
                margin-bottom: 20px;
                background: #f8f9ff;
            }
            .title {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #667eea;
            }
            .subtitle {
                font-size: 16px;
                color: #4a5568;
            }
            .content-area {
                flex: 1;
                padding: 20px;
            }
            .voter-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            .info-section {
                border: 1px solid #e1e5fe;
                padding: 12px;
                border-radius: 8px;
                background: #f8f9ff;
            }
            .section-title {
                font-size: 14px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 8px;
                border-bottom: 1px solid #667eea;
                padding-bottom: 4px;
                text-transform: uppercase;
            }
            .info-row {
                display: flex;
                margin-bottom: 6px;
                align-items: center;
            }
            .label {
                font-weight: bold;
                width: 100px;
                color: #4a5568;
                font-size: 11px;
            }
            .value {
                color: #2d3748;
                font-size: 11px;
                font-weight: 500;
            }
            .full-width {
                grid-column: 1 / -1;
            }

            @media print {
                body { 
                    margin: 0; 
                    background: white !important;
                }
                .container {
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${posterExists ? `
            <div class="poster-header">
                <img src="${posterBase64}" alt="Poster" class="poster-image" />
            </div>
            ` : ''}
            
            <div class="content-area">
                <div class="header">
                    <div class="title">कागल विधान सभा मतदार माहिती</div>
                    <div class="title">Kagal Assembly Constituency Voter Information</div>
                    <div class="subtitle">2024</div>
                </div>

            <div class="voter-info">
                <div class="info-section">
                    <div class="section-title">Personal Information</div>
                    <div class="info-row">
                        <span class="label">Name (English):</span>
                        <span class="value">${firstNameEng} ${middleNameEng} ${surnameEng}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Name (Marathi):</span>
                        <span class="value">${firstName} ${middleName} ${surname}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">EPIC No:</span>
                        <span class="value">${voter.EPIC || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Age:</span>
                        <span class="value">${voter.Age || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Gender:</span>
                        <span class="value">${voter.Gender || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Mobile:</span>
                        <span class="value">${voter['Mobile No'] || 'N/A'}</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title">Voting Information</div>
                    <div class="info-row">
                        <span class="label">Serial No:</span>
                        <span class="value">${voter['Serial No'] || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Booth No:</span>
                        <span class="value">${voter['Booth No'] || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Booth Name:</span>
                        <span class="value">${voter['Booth Name'] || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Booth (Marathi):</span>
                        <span class="value">${voter['Ebooth Name'] || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Part:</span>
                        <span class="value">${voter.Part || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Part Name:</span>
                        <span class="value">${voter['Part Name'] || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div class="info-section full-width">
                <div class="section-title">Address & Family Information</div>
                <div class="voter-info">
                    <div>
                        <div class="info-row">
                            <span class="label">House No:</span>
                            <span class="value">${voter['House No'] || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Address:</span>
                            <span class="value">${voter.Address || 'N/A'}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-row">
                            <span class="label">Father's Name:</span>
                            <span class="value">${voter['Father Name'] || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Father (Marathi):</span>
                            <span class="value">${voter['MFather Name'] || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Relation:</span>
                            <span class="value">${voter.Relation || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    const filename = `voter_${id}_${firstNameEng}_${surnameEng}.pdf`.replace(/\s+/g, '_');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF'
    });
  }
};

module.exports = {
  generateVoterPdf
};