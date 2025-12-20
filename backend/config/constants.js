// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================

// Database Table Names
const TABLES = {
  VOTERS: 'kagal_data',
  USERS: 'users',
  BLACKLISTED_TOKENS: 'blacklisted_tokens'
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
  UPLOAD_DIR: 'uploads/',
  FILENAME_PREFIX: 'csv_upload_'
};

// Cache Configuration
const CACHE = {
  PERMISSION_TTL: 6000000, // 6000 seconds
  DEFAULT_TTL: 300000 // 5 minutes
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Database Column Names
const DB_COLUMNS = {
  VOTERS: {
    ID: 'id',
    EPIC_NO: 'epic_no',
    FULL_NAME: 'full_name',
    MOBILE: 'mobile',
    AGE: 'age',
    GENDER: 'gender',
    WARD_NO: 'ward_no',
    BOOTH_NO: 'booth_no',
    SERIAL_NO: 'serial_no',
    NEW_ADDRESS: 'new_address',
    SOCIETY_NAME: 'society_name',
    MUNICIPALITY: 'municipality',
    ASSEMBLY_NO: 'assembly_no',
    DOB: 'dob',
    DEMANDS: 'demands',
    WORKER_NAME: 'worker_name',
    FLAT_NO: 'flat_no',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
  },
  USERS: {
    ID: 'id',
    NAME: 'name',
    EMAIL: 'email',
    MOBILE: 'mobile',
    PASSWORD: 'password',
    PASSWORDB64: 'passwordb64',
    ROLE: 'role',
    WARD_ID: 'ward_id',
    WARD_NAME: 'ward_name',
    STATUS: 'status',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
  },
  BLACKLISTED_TOKENS: {
    ID: 'id',
    TOKEN: 'token',
    EXPIRES_AT: 'expires_at',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
  }
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
    INVALID_CSV_HEADERS: 'CSV contains invalid field names.',
    MISSING_REQUIRED_HEADERS: 'CSV is missing required fields.',
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
  TYPES: ['name', 'epic', 'mobile'],
  DEFAULT_TYPE: 'name'
};

// Export all constants
module.exports = {
  TABLES,
  VOTER_FIELDS,
  VALIDATION,
  UPLOAD,
  CACHE,
  HTTP_STATUS,
  DB_COLUMNS,
  MESSAGES,
  JWT,
  PAGINATION,
  SEARCH
};