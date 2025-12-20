const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('../../config/database');
const { TABLES, VOTER_FIELDS, VALIDATION, MESSAGES, PAGINATION, HTTP_STATUS, DB_COLUMNS } = require('../../config/constants');

exports.uploadVoterFile = async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
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
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
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
    let csvHeaders = [];
    let headerValidationDone = false;

    // Read and parse CSV file with header validation
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers) => {
          csvHeaders = headers;
          
          // Validate CSV headers immediately when headers are detected
          const invalidHeaders = csvHeaders.filter(header => 
            !VOTER_FIELDS.ALLOWED_CSV_FIELDS.includes(header)
          );

          if (invalidHeaders.length > 0) {
            const errorMessage = `${MESSAGES.ERROR.INVALID_CSV_HEADERS}\n\n` +
              `❌ Invalid field names found: ${invalidHeaders.join(', ')}\n\n` +
              `✅ Allowed field names are:\n${VOTER_FIELDS.ALLOWED_CSV_FIELDS.join(', ')}\n\n` +
              `📝 Please check your CSV headers and make sure they match exactly (case-sensitive).`;
            reject(new Error(errorMessage));
            return;
          }

          // Check if required fields are present in headers
          const missingRequiredHeaders = VOTER_FIELDS.REQUIRED.filter(field => 
            !csvHeaders.includes(field)
          );

          if (missingRequiredHeaders.length > 0) {
            const errorMessage = `${MESSAGES.ERROR.MISSING_REQUIRED_HEADERS}\n\n` +
              `❌ Missing required fields: ${missingRequiredHeaders.join(', ')}\n\n` +
              `✅ Required fields are: ${VOTER_FIELDS.REQUIRED.join(', ')}\n\n` +
              `📝 Your CSV must contain all required fields.`;
            reject(new Error(errorMessage));
            return;
          }

          headerValidationDone = true;
        })
        .on('data', (row) => {
          // Only process data if header validation passed
          if (headerValidationDone) {
            csvData.push(row);
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', reject);
    });

    // Process each row
    for (const row of csvData) {
      try {
        // Map CSV columns to database columns using STRICT field names
        const voterData = {};

        // Only process fields that are in ALLOWED_CSV_FIELDS
        VOTER_FIELDS.ALLOWED_CSV_FIELDS.forEach(field => {
          if (row[field] !== undefined && row[field] !== null && row[field].toString().trim() !== '') {
            voterData[field] = row[field].toString().trim();
          }
        });

        // VALIDATION: Check required fields using constants
        const missingRequiredFields = [];

        VOTER_FIELDS.REQUIRED.forEach(field => {
          if (!voterData[field] || voterData[field].toString().trim() === '') {
            missingRequiredFields.push(field);
          }
        });

        // Skip row if required fields are missing
        if (missingRequiredFields.length > 0) {
          skipped++;
          continue;
        }

        // Additional validation using constants
        if (voterData.age) {
          const ageNum = parseInt(voterData.age);
          if (!isNaN(ageNum) && (ageNum < VALIDATION.AGE.MIN || ageNum > VALIDATION.AGE.MAX)) {
            skipped++;
            continue;
          }
        }

        // Validate EPIC length
        if (voterData.epic_no && (voterData.epic_no.length < VALIDATION.EPIC.MIN_LENGTH || voterData.epic_no.length > VALIDATION.EPIC.MAX_LENGTH)) {
          skipped++;
          continue;
        }

        totalProcessed++;

        // Check if voter exists by epic_no using table constant
        const existingVoter = await db(TABLES.VOTERS)
          .where(DB_COLUMNS.VOTERS.EPIC_NO, voterData.epic_no)
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
              .where(DB_COLUMNS.VOTERS.EPIC_NO, voterData.epic_no)
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

    // Send the detailed error message as the main message
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message, // Use the detailed error message directly
      error: MESSAGES.ERROR.UPLOAD_FAILED,
      details: 'Please fix the issues above and try again'
    });
  }
};

exports.getVoterData = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, 1), PAGINATION.MAX_LIMIT);
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCountResult = await db(TABLES.VOTERS).count(`${DB_COLUMNS.VOTERS.ID} as total`).first();
    const totalRecords = parseInt(totalCountResult.total) || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated data
    const voterData = await db(TABLES.VOTERS)
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy(DB_COLUMNS.VOTERS.ID, 'asc');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: totalRecords > 0 ? "Data retrieved successfully" : "No data found",
      data: voterData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        limit: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        recordsOnPage: voterData.length
      }
    });
  } catch (err) {
    console.error('Get voter data error:', err);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to get voter data',
      error: err.message
    });
  }
};
