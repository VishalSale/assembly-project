// =============================================================================
// FRONTEND APPLICATION CONSTANTS
// =============================================================================

// Voter Data Field Mappings (should match backend)
export const VOTER_FIELDS = {
    // Required fields for CSV upload validation (must be present and not empty)
    REQUIRED: ['epic_no', 'full_name', 'age', 'gender'],

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
    ],

    // Optional fields (for display purposes)
    OPTIONAL: [
        'municipality',
        'ward_no',
        'booth_no',
        'serial_no',
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

// File Upload Configuration
export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILE_SIZE_TEXT: '10MB',
    ALLOWED_EXTENSIONS: ['.csv'],
    ALLOWED_MIME_TYPES: ['text/csv'],
    ACCEPTED_FILE_TYPES: '.csv'
};

// UI Messages and Text
export const UI_MESSAGES = {
    UPLOAD: {
        TITLE: 'Upload CSV File',
        DESCRIPTION: 'Select or drag and drop a CSV file to upload voter data',
        BROWSE_TEXT: 'Browse Files',
        DRAG_TEXT: 'Choose CSV file or drag it here',
        FILE_TYPE_TEXT: 'Only CSV files are allowed',
        UPLOADING: 'Uploading...',
        UPLOAD_BUTTON: 'Upload File'
    },
    SUCCESS: {
        UPLOAD_SUCCESS: 'File uploaded successfully!',
        MODAL_TITLE: 'Upload Successful!',
        MODAL_DESCRIPTION: 'Your CSV file has been processed successfully'
    },
    ERROR: {
        UPLOAD_FAILED: 'Upload failed. Please try again.',
        INVALID_FILE: 'Please select a valid CSV file only.',
        SESSION_EXPIRED: 'Session expired. Please login again.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        MODAL_TITLE: 'Upload Failed',
        MODAL_DESCRIPTION: 'There was an issue with your CSV file'
    },
    REQUIREMENTS: {
        TITLE: 'File Requirements:',
        FILE_FORMAT: 'CSV only',
        CASE_SENSITIVE: 'Field names must match exactly (case-sensitive)',
        REQUIRED_FIELDS_TITLE: 'Required Fields (must be present):',
        OPTIONAL_FIELDS_TITLE: 'Optional Fields (exact names only):',
        SAMPLE_FORMAT_TITLE: 'Sample CSV Format:',
        VALIDATION_NOTES_TITLE: 'Important Notes:',
        VALIDATION_NOTES: [
            'Column names must match exactly (case-sensitive)',
            'Required fields cannot be empty or null',
            'System will automatically handle duplicates by updating existing records',
            'Invalid column names will cause upload to fail'
        ]
    },
    EXPORT: {
        TITLE: 'Export Feature',
        MESSAGE: 'Export functionality will be implemented soon! This feature will allow you to download voter data in CSV format.',
        BUTTON_TEXT: 'Got it, thanks!'
    }
};

// Table Configuration
export const TABLE_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    SEARCH_PLACEHOLDER: 'Search by name, EPIC, mobile, or address...'
};

// Modal Configuration
export const MODAL_CONFIG = {
    ANIMATION_DURATION: 300, // milliseconds
    BACKDROP_BLUR: true
};

// Admin Configuration
export const ADMIN_CONFIG = {
    DEFAULT_AVATAR: '/images/admin-avatar.png',
    SESSION_STORAGE_KEYS: {
        USER: 'adminUser',
        TOKEN: 'adminToken'
    }
};

// Routes
export const ROUTES = {
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard'
};

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
    ADMIN: {
        LOGIN: '/api/admin/auth/login',
        LOGOUT: '/api/admin/auth/logout',
        UPLOAD_CSV: '/api/admin/upload-csv',
        GET_VOTERS: '/api/admin/get-voters'
    },
    PUBLIC: {
        SEARCH: '/api/search',
        GENERATE_PDF: '/api/generate-pdf',
        SHARE_IMAGE: '/api/share-image'
    }
};

// Sample CSV Data
export const SAMPLE_CSV = {
    HEADERS: 'municipality,ward_no,booth_no,serial_no,assembly_no,mobile,dob,demands,worker_name,new_address,society_name,flat_no,epic_no,full_name,age,gender',
    ROWS: [
        'Pune,12,45,123,210,9876543210,1992-05-14,Water connection,Ramesh Patil,Shivaji Nagar,Green Society,A-101,ABC1234567,Rahul Patil,32,Male',
        'Nagpur,7,18,456,134,9123456789,1996-08-22,Road repair,Suresh Deshmukh,Dharampeth,Sunrise Society,B-204,XYZ9876543,Sunita Deshmukh,28,Female'
    ]
};

// Color Themes
export const COLORS = {
    PRIMARY: '#2d3748',
    SUCCESS: '#38a169',
    ERROR: '#e53e3e',
    WARNING: '#dd6b20',
    INFO: '#3182ce',
    GRAY: '#718096'
};

// Responsive Breakpoints
export const BREAKPOINTS = {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px'
};

// Default export for easy importing
const CONSTANTS = {
    VOTER_FIELDS,
    UPLOAD_CONFIG,
    UI_MESSAGES,
    TABLE_CONFIG,
    MODAL_CONFIG,
    ADMIN_CONFIG,
    ROUTES,
    API_ENDPOINTS,
    SAMPLE_CSV,
    COLORS,
    BREAKPOINTS
};

export default CONSTANTS;