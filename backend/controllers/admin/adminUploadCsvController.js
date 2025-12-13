const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('../../config/database');
const { TABLES, VOTER_FIELDS, VALIDATION, MESSAGES, PAGINATION } = require('../../config/constants');

exports.uploadVoterFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'CSV file is required' 
    });
  }

  // Validate file type
  if (!req.file.originalname.toLowerCase().endsWith('.csv')) {
    // Delete uploaded file if it's not CSV
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ 
      success: false,
      message: 'Only CSV files are allowed' 
    });
  }

  const filePath = req.file.path;
  const csvData = [];
  let totalProcessed = 0;
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  let skipped = 0;

  try {
    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          csvData.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', reject);
    });

    // Process each row
    for (const row of csvData) {
      try {
        // Map CSV columns to database columns using constants
        const voterData = {};
        
        // Use CSV mapping from constants for flexible column names
        Object.keys(VOTER_FIELDS.CSV_MAPPING).forEach(dbField => {
          const csvVariations = VOTER_FIELDS.CSV_MAPPING[dbField];
          for (const csvField of csvVariations) {
            if (row[csvField] && row[csvField].toString().trim() !== '') {
              voterData[dbField] = row[csvField].toString().trim();
              break; // Use first found variation
            }
          }
        });

        // VALIDATION: Check required fields using constants
        const requiredFields = [];
        
        VOTER_FIELDS.REQUIRED.forEach(field => {
          if (!voterData[field] || voterData[field].toString().trim() === '') {
            requiredFields.push(field);
          }
        });

        // Skip row if required fields are missing
        if (requiredFields.length > 0) {
          console.log(`⚠️ Skipping row - missing required fields: ${requiredFields.join(', ')}`);
          skipped++;
          continue;
        }

        // Additional validation using constants
        if (voterData.age) {
          const ageNum = parseInt(voterData.age);
          if (!isNaN(ageNum) && (ageNum < VALIDATION.AGE.MIN || ageNum > VALIDATION.AGE.MAX)) {
            console.log(`⚠️ Skipping row - invalid age: ${voterData.age} (must be between ${VALIDATION.AGE.MIN}-${VALIDATION.AGE.MAX})`);
            skipped++;
            continue;
          }
        }

        // Validate EPIC length
        if (voterData.epic_no && (voterData.epic_no.length < VALIDATION.EPIC.MIN_LENGTH || voterData.epic_no.length > VALIDATION.EPIC.MAX_LENGTH)) {
          console.log(`⚠️ Skipping row - invalid EPIC length: ${voterData.epic_no}`);
          skipped++;
          continue;
        }

        totalProcessed++;

        // Check if voter exists by epic_no using table constant
        const existingVoter = await db(TABLES.VOTERS)
          .where('epic_no', voterData.epic_no)
          .first();

        if (existingVoter) {
          // UPDATE: Only update fields that have new data
          const updateData = {};
          
          // Compare each field and only update if new data is provided and different
          Object.keys(voterData).forEach(key => {
            const newValue = voterData[key];
            const existingValue = existingVoter[key];
            
            // Update if new value exists and is different from existing
            if (newValue !== null && newValue !== undefined && 
                newValue.toString().trim() !== '' && 
                newValue !== existingValue) {
              updateData[key] = newValue;
            }
          });

          if (Object.keys(updateData).length > 0) {
            await db(TABLES.VOTERS)
              .where('epic_no', voterData.epic_no)
              .update(updateData);
            
            updated++;
          }
        } else {
          // INSERT: New voter
          await db(TABLES.VOTERS).insert(voterData);
          inserted++;
        }

      } catch (rowError) {
        console.error('❌ Error processing row:', rowError.message);
        errors++;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: MESSAGES.SUCCESS.CSV_UPLOAD,
      data: {
        total_rows_in_csv: csvData.length,
        total_processed: totalProcessed,
        inserted: inserted,
        updated: updated,
        errors: errors,
        skipped: skipped,
        summary: `Processed ${totalProcessed} valid records from ${csvData.length} CSV rows`
      }
    });

  } catch (err) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({
      success: false,
      message: MESSAGES.ERROR.UPLOAD_FAILED,
      error: err.message,
      details: 'Check server logs for more information'
    });
  }
};

exports.getVoterData = async (req, res) => {
  try {
    const voterData = await db(TABLES.VOTERS).select('*').limit(PAGINATION.DEFAULT_LIMIT);
    
    if(!voterData || voterData.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: voterData,
      count: voterData.length
    });
  } catch (err) {
    console.error('Get voter data error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get voter data',
      error: err.message
    });
  }
};