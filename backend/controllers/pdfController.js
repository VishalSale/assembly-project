const validator = require('validator');
const { db } = require('../config/database');
const { TABLES, HTTP_STATUS, DB_COLUMNS } = require('../config/constants');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Generate PDF for voter information
const generateVoterPdf = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate voter ID
        if (!id || !validator.isInt(id.toString())) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: 'Invalid voter ID'
            });
        }

        // Fetch voter data from database
        const voter = await db(TABLES.VOTERS)
            .where(DB_COLUMNS.VOTERS.ID, id)
            .first();

        if (!voter) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: 'Voter not found'
            });
        }

        // Parse names
        // const englishNameParts = (voter.full_name || '').split(' ');
        // const firstNameEng = englishNameParts[0] || '';
        // const middleNameEng = englishNameParts[1] || '';
        // const surnameEng = englishNameParts.slice(2).join(' ') || '';
        const fullName = voter[DB_COLUMNS.VOTERS.FULL_NAME];
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

        // Create slip format HTML template matching your reference image
        const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Voter Slip - ${fullName}</title>
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
                margin: 0;
                background: white;
                border: 2px solid black;
                overflow: hidden;
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
                padding: 8px;
                border-bottom: 2px solid black;
                background: white;
            }
            
            .label {
                font-size: 10px;
                font-weight: normal;
                color: black;
                margin-bottom: 4px;
            }
            
            .value {
                font-size: 20px;
                font-weight: bold;
                color: black;
            }
            
            .name-value {
                font-size: 16px;
                font-weight: bold;
                color: black;
                text-transform: uppercase;
            }
            
            .footer {
                text-align: center;
                padding: 6px;
                background: white;
                font-size: 11px;
                color: black;
                font-weight: bold;
            }
            
            @media print {
                body { 
                    margin: 0; 
                    padding: 10px;
                }
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
                        <div class="value">${voter[DB_COLUMNS.VOTERS.WARD_NO] || 'N/A'}</div>
                    </div>
                    <div class="cell">
                        <div class="label">अनुक्रमांक (Serial No)</div>
                        <div class="value">${voter[DB_COLUMNS.VOTERS.SERIAL_NO] || 'N/A'}</div>
                    </div>
                </div>
                
                <!-- Name -->
                <div class="full-width">
                    <div class="label">नाव (Name):</div>
                    <div class="name-value">${voter[DB_COLUMNS.VOTERS.FULL_NAME] || 'N/A'}</div>
                </div>
                
                <!-- EPIC Number -->
                <div class="full-width">
                    <div class="label">EPIC क्रमांक (EPIC No):</div>
                    <div class="name-value">${voter[DB_COLUMNS.VOTERS.EPIC_NO] || 'N/A'}</div>
                </div>
                
                <!-- Age and Gender -->
                <div class="row">
                    <div class="cell">
                        <div class="label">वय (Age):</div>
                        <div class="value">${voter[DB_COLUMNS.VOTERS.AGE] || 'N/A'}</div>
                    </div>
                    <div class="cell">
                        <div class="label">लिंग (Gender):</div>
                        <div class="value">${voter[DB_COLUMNS.VOTERS.GENDER] || 'N/A'}</div>
                    </div>
                </div>
                
                <!-- Address -->
                <div class="full-width">
                    <div class="label">पत्ता (Address):</div>
                    <div class="value">${voter[DB_COLUMNS.VOTERS.NEW_ADDRESS] || 'N/A'}</div>
                </div>
                
                <!-- Polling Station -->
                <div class="full-width">
                    <div class="label">मतदान केंद्राचे नाव व पत्ता:</div>
                    <div class="value">${voter[DB_COLUMNS.VOTERS.BOOTH_NO] || 'N/A'}</div>
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

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

        // Get actual content height to ensure it fits on one page
        const contentHeight = await page.evaluate(() => {
            return document.querySelector('.voter-slip').offsetHeight;
        });

        const pdfBuffer = await page.pdf({
            width: '440px',
            height: `${Math.max(contentHeight + 20, 500)}px`, // Dynamic height based on content
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        await browser.close();

        // Set response headers for PDF download
        // Clean filename to remove invalid characters
        const cleanName = (fullName || 'voter').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `voter_slip_${id}_${cleanName}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            success: false,
            error: 'Failed to generate PDF'
        });
    }
};

module.exports = {
    generateVoterPdf
};