const validator = require('validator');
const { db } = require('../config/database');

// Validation helper functions
const validateSearchInput = (searchType, searchData) => {
  const errors = [];

  if (!searchType || !['name', 'epic', 'mobile', 'address', 'booth', 'serial'].includes(searchType)) {
    errors.push('Invalid search type');
  }

  switch (searchType) {
    case 'name':
      if (!searchData.firstname && !searchData.middlename && !searchData.surname && !searchData.name) {
        errors.push('At least one name field is required');
      }
      if (searchData.firstname && !validator.isLength(searchData.firstname, { min: 1, max: 255 })) {
        errors.push('First name must be between 1 and 255 characters');
      }
      if (searchData.middlename && !validator.isLength(searchData.middlename, { min: 1, max: 255 })) {
        errors.push('Middle name must be between 1 and 255 characters');
      }
      if (searchData.surname && !validator.isLength(searchData.surname, { min: 1, max: 255 })) {
        errors.push('Surname must be between 1 and 255 characters');
      }
      break;

    case 'mobile':
      if (!searchData.mobile) {
        errors.push('Mobile number is required');
      } else if (!validator.isLength(searchData.mobile, { min: 1, max: 20 })) {
        errors.push('Mobile number must be between 1 and 20 characters');
      }
      break;

    case 'epic':
      if (!searchData.epic) {
        errors.push('EPIC number is required');
      } else if (!validator.isLength(searchData.epic, { min: 1, max: 50 })) {
        errors.push('EPIC number must be between 1 and 50 characters');
      }
      break;

    case 'address':
      if (!searchData.address) {
        errors.push('Address is required');
      } else if (!validator.isLength(searchData.address, { min: 1, max: 500 })) {
        errors.push('Address must be between 1 and 500 characters');
      }
      break;

    case 'booth':
      if (!searchData.boothNo) {
        errors.push('Booth number is required');
      } else if (!validator.isLength(searchData.boothNo, { min: 1, max: 50 })) {
        errors.push('Booth number must be between 1 and 50 characters');
      }
      break;

    case 'serial':
      if (!searchData.serialNo) {
        errors.push('Serial number is required');
      } else if (!validator.isLength(searchData.serialNo, { min: 1, max: 50 })) {
        errors.push('Serial number must be between 1 and 50 characters');
      }
      break;
  }

  return errors;
};

// Search voters controller
const searchVoters = async (req, res) => {
  try {
    const { searchType, page = 1, limit = 16, ...searchData } = req.body;

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!validator.isInt(page.toString(), { min: 1 })) {
      return res.status(400).json({
        success: false,
        error: 'Page must be a positive integer'
      });
    }

    if (!validator.isInt(limit.toString(), { min: 1, max: 100 })) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100'
      });
    }

    // Validate search input
    const validationErrors = validateSearchInput(searchType, searchData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

    const offset = (pageNum - 1) * limitNum;

    // Build query based on search type
    let query = db('kagal_data');
    
    switch (searchType) {
      case 'name':
        if (searchData.firstname) {
          query = query.where(function() {
            this.where('EFullName', 'ilike', `%${searchData.firstname}%`)
                .orWhere('MFullName', 'ilike', `%${searchData.firstname}%`);
          });
        }
        if (searchData.middlename) {
          query = query.where(function() {
            this.where('EFullName', 'ilike', `%${searchData.middlename}%`)
                .orWhere('MFullName', 'ilike', `%${searchData.middlename}%`);
          });
        }
        if (searchData.surname) {
          query = query.where(function() {
            this.where('EFullName', 'ilike', `%${searchData.surname}%`)
                .orWhere('MFullName', 'ilike', `%${searchData.surname}%`);
          });
        }
        if (searchData.name) {
          query = query.where(function() {
            this.where('EFullName', 'ilike', `%${searchData.name}%`)
                .orWhere('MFullName', 'ilike', `%${searchData.name}%`);
          });
        }
        break;

      case 'mobile':
        query = query.where('Mobile No', 'ilike', `%${searchData.mobile}%`);
        break;

      case 'booth':
        query = query.where('Booth No', searchData.boothNo);
        break;

      case 'epic':
        query = query.where('EPIC', 'ilike', `%${searchData.epic}%`);
        break;

      case 'address':
        query = query.where(function() {
          this.where('Address', 'ilike', `%${searchData.address}%`)
              .orWhere('Booth Name', 'ilike', `%${searchData.address}%`)
              .orWhere('Ebooth Name', 'ilike', `%${searchData.address}%`);
        });
        break;

      case 'serial':
        query = query.where('Serial No', searchData.serialNo);
        break;
    }

    // Get total count
    const countQuery = query.clone();
    const totalResult = await countQuery.count('id as total').first();
    const totalRecords = parseInt(totalResult.total);
    const totalPages = Math.ceil(totalRecords / limitNum);

    // Get paginated results
    const voters = await query
      .select('*')
      .limit(limitNum)
      .offset(offset)
      .orderBy('id');

    // Format response to match frontend expectations
    const formattedVoters = voters.map(voter => {
      // Parse English full name
      const englishNameParts = (voter.EFullName || '').split(' ');
      const firstNameEng = englishNameParts[0] || '';
      const middleNameEng = englishNameParts[1] || '';
      const surnameEng = englishNameParts.slice(2).join(' ') || '';
      
      // Parse Marathi full name
      const marathiNameParts = (voter.MFullName || '').split(' ');
      const firstName = marathiNameParts[0] || '';
      const middleName = marathiNameParts[1] || '';
      const surname = marathiNameParts.slice(2).join(' ') || '';

      return {
        id: voter.id,
        // English names
        firstNameEng,
        middleNameEng,
        surnameEng,
        fullNameEng: voter.EFullName || '',
        // Marathi names
        firstName,
        middleName,
        surname,
        fullNameMarathi: voter.MFullName || '',
        // Contact & Identity
        mobile: voter['Mobile No'] || '',
        epic: voter.EPIC || '',
        age: voter.Age || '',
        gender: voter.Gender || '',
        // Voting details
        serialNo: voter['Serial No'] || '',
        srNo: voter['Serial No'] || '',
        booth: voter['Booth No'] || '',
        boothName: voter['Booth Name'] || '',
        eboothName: voter['Ebooth Name'] || '',
        part: voter.Part || '',
        partName: voter['Part Name'] || '',
        // Address & Family
        address: voter.Address || '',
        houseNo: voter['House No'] || '',
        fatherName: voter['Father Name'] || '',
        mFatherName: voter['MFather Name'] || '',
        relation: voter.Relation || ''
      };
    });

    res.json({
      success: true,
      data: formattedVoters,
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
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  searchVoters
};