const validator = require('validator');
const { db } = require('../config/database');
const { TABLES, HTTP_STATUS, DB_COLUMNS } = require('../config/constants');

// Validation helper functions - Updated for new kagal_data structure
const validateSearchInput = (searchType, searchData) => {
  const errors = [];

  if (!searchType || !['name', 'epic', 'mobile', 'address'].includes(searchType)) {
    errors.push('Invalid search type. Must be: name, epic, mobile, or address');
  }

  switch (searchType) {
    case 'name':
      const nameQuery = searchData.query || 
        [searchData.firstname, searchData.middlename, searchData.surname]
          .filter(Boolean).join(' ');
      
      if (!nameQuery) {
        errors.push('Name query is required');
      } else if (!validator.isLength(nameQuery, { min: 1, max: 255 })) {
        errors.push('Name must be between 1 and 255 characters');
      }
      break;

    case 'mobile':
      const mobileQuery = searchData.query || searchData.mobile;
      if (!mobileQuery) {
        errors.push('Mobile number is required');
      } else if (!validator.isLength(mobileQuery, { min: 1, max: 20 })) {
        errors.push('Mobile number must be between 1 and 20 characters');
      }
      break;

    case 'epic':
      const epicQuery = searchData.query || searchData.epic;
      if (!epicQuery) {
        errors.push('EPIC number is required');
      } else if (!validator.isLength(epicQuery, { min: 1, max: 50 })) {
        errors.push('EPIC number must be between 1 and 50 characters');
      }
      break;

    case 'address':
      const addressQuery = searchData.query || searchData.address;
      if (!addressQuery) {
        errors.push('Address is required');
      } else if (!validator.isLength(addressQuery, { min: 1, max: 500 })) {
        errors.push('Address must be between 1 and 500 characters');
      }
      break;
  }

  return errors;
};

// Search voters controller - Updated for new kagal_data table structure
const searchVoters = async (req, res) => {
  try {
    // Support both GET and POST requests
    const isGet = req.method === 'GET';
    const { type, query: searchQuery, page = 1, limit = 16 } = isGet ? req.query : req.body;
    
    // For backward compatibility, also support old format
    const searchType = type || req.body.searchType;
    const searchData = isGet ? { query: searchQuery } : req.body;

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!validator.isInt(page.toString(), { min: 1 })) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Page must be a positive integer'
      });
    }

    if (!validator.isInt(limit.toString(), { min: 1, max: 100 })) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Limit must be between 1 and 100'
      });
    }

    if (!searchType || !['name', 'epic', 'mobile', 'address'].includes(searchType)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid search type. Must be: name, epic, mobile, or address'
      });
    }

    const offset = (pageNum - 1) * limitNum;

    // Build query based on search type using new kagal_data table structure
    let query = db(TABLES.VOTERS);
    
    switch (searchType) {
      case 'name':
        const nameQuery = isGet ? searchQuery : 
          [searchData.firstname, searchData.middlename, searchData.surname]
            .filter(Boolean).join(' ') || searchData.query;
        
        if (nameQuery) {
          query = query.where(DB_COLUMNS.VOTERS.FULL_NAME, 'ilike', `%${nameQuery}%`);
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Name query is required'
          });
        }
        break;

      case 'mobile':
        const mobileQuery = isGet ? searchQuery : searchData.mobile || searchData.query;
        if (mobileQuery) {
          query = query.where(DB_COLUMNS.VOTERS.MOBILE, 'ilike', `%${mobileQuery}%`);
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Mobile number is required'
          });
        }
        break;

      case 'epic':
        const epicQuery = isGet ? searchQuery : searchData.epic || searchData.query;
        if (epicQuery) {
          query = query.where(DB_COLUMNS.VOTERS.EPIC_NO, 'ilike', `%${epicQuery}%`);
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'EPIC number is required'
          });
        }
        break;

      case 'address':
        const addressQuery = isGet ? searchQuery : searchData.address || searchData.query;
        if (addressQuery) {
          query = query.where(function() {
            this.where(DB_COLUMNS.VOTERS.NEW_ADDRESS, 'ilike', `%${addressQuery}%`)
                .orWhere(DB_COLUMNS.VOTERS.SOCIETY_NAME, 'ilike', `%${addressQuery}%`)
                .orWhere(DB_COLUMNS.VOTERS.MUNICIPALITY, 'ilike', `%${addressQuery}%`);
          });
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Address query is required'
          });
        }
        break;
    }

    // Get total count
    const countQuery = query.clone();
    const totalResult = await countQuery.count(`${DB_COLUMNS.VOTERS.ID} as total`).first();
    const totalRecords = parseInt(totalResult.total);
    const totalPages = Math.ceil(totalRecords / limitNum);

    // Get paginated results
    const voters = await query
      .select('*')
      .limit(limitNum)
      .offset(offset)
      .orderBy(DB_COLUMNS.VOTERS.ID);

    // Return data in new format (matching kagal_data table structure)
    res.json({
      success: true,
      data: voters, // Return raw data from kagal_data table
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  searchVoters
};