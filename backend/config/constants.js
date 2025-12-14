// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

// Database Table Names
const TABLES = {
  VOTERS: 'kagal_data',
  USERS: 'users'
};

// Voter Data Field Mappings
const VOTER_FIELDS = {
  // Required fields for CSV upload validation (must be present and not empty)
  REQUIRED: ['epic_no', 'full_name', 'age', 'gender'],
  
  // All available fields in kagal_data table
  ALL: [
    'id',
    'municipality',
    'ward_no', 
    'booth_no',
    'serial_no',
    'full_name',
    'gender',
    'age',
    'epic_no',
    'assembly_no',
    'mobile',
    'dob',
    'demands',
    'worker_name',
    'new_address',
    'society_name',
    'flat_no',
    'created_at',
    'updated_at'
  ],

  // STRICT CSV FIELD NAMES - Must match exactly (case-sensitive)
  // Only these field names are allowed in CSV uploads
  ALLOWED_CSV_FIELDS: [
    'municipality',
    'ward_no',
    'booth_no', 
    'serial_no',
    'full_name',
    'gender',
    'age',
    'epic_no',
    'assembly_no',
    'mobile',
    'dob',
    'demands',
    'worker_name',
    'new_address',
    'society_name',
    'flat_no'
  ]
};

// Validation Rules
const VALIDATION = {
  AGE: {
    MIN: 18,
    MAX: 120
  },
  EPIC: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20
  },
  MOBILE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  }
};

// File Upload Configuration
const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.csv'],
  ALLOWED_MIME_TYPES: ['text/csv', 'application/csv'],
  UPLOAD_DIR: 'uploads/'
};

// API Response Messages
const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful',
    LOGOUT: 'Logged out successfully',
    CSV_UPLOAD: 'CSV uploaded and processed successfully',
    DATA_RETRIEVED: 'Data retrieved successfully'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    MISSING_FIELDS: 'Required fields are missing',
    INVALID_FILE: 'Invalid file format',
    CSV_REQUIRED: 'CSV file is required',
    CSV_ONLY: 'Only CSV files are allowed',
    UPLOAD_FAILED: 'CSV upload failed',
    INVALID_CSV_HEADERS: 'Invalid CSV headers. Field names must match exactly.',
    MISSING_REQUIRED_HEADERS: 'Missing required CSV headers.',
    INTERNAL_ERROR: 'Internal server error',
    UNAUTHORIZED: 'Access denied. No token provided.',
    INVALID_TOKEN: 'Invalid or expired token.'
  }
};

// JWT Configuration
const JWT = {
  EXPIRES_IN: '1d',
  ALGORITHM: 'HS256'
};

// Pagination
const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Search Configuration
const SEARCH = {
  TYPES: ['name', 'epic', 'mobile', 'address'],
  DEFAULT_TYPE: 'name'
};

// Export all constants
module.exports = {
  TABLES,
  VOTER_FIELDS,
  VALIDATION,
  UPLOAD,
  MESSAGES,
  JWT,
  PAGINATION,
  SEARCH
};