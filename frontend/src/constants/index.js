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
        UPLOAD_BUTTON: 'Upload File',
        PROCESSING: 'Uploading and processing CSV file...',
        UPLOAD_FAILED_CHECK: 'Upload failed. Please check your file.',
        FILE_REMOVED: 'File removed. You can select a new file.'
    },
    SUCCESS: {
        UPLOAD_SUCCESS: 'File uploaded successfully!',
        MODAL_TITLE: 'Upload Successful!',
        MODAL_DESCRIPTION: 'Your CSV file has been processed successfully',
        LOGIN_SUCCESS: 'Login successful! Welcome to admin dashboard.',
        LOGOUT_SUCCESS: 'Logged out successfully. See you next time!',
        PDF_DOWNLOAD: 'PDF download started successfully!',
        SHARE_SUCCESS: 'Voter information shared successfully!',
        FILE_SELECTED: 'File selected successfully!'
    },
    ERROR: {
        UPLOAD_FAILED: 'Upload failed. Please try again.',
        INVALID_FILE: 'Please select a valid CSV file only.',
        SESSION_EXPIRED: 'Session expired. Please login again.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        MODAL_TITLE: 'Upload Failed',
        MODAL_DESCRIPTION: 'There was an issue with your CSV file',
        LOGIN_FAILED: 'Invalid email or password',
        LOGOUT_FAILED: 'Logout failed, but redirecting anyway.',
        SHARE_FAILED: 'Share failed. Opening image in new tab as fallback.'
    },
    INFO: {
        SEARCHING: 'Searching for voters...',
        LOADING_PAGE: 'Loading page',
        REFRESHING: 'Refreshing voter data...',
        EXPORT_SOON: 'Export feature will be available soon!',
        PDF_GENERATING: 'Generating PDF download...',
        SHARE_PREPARING: 'Preparing voter information for sharing...',
        PAGE_SIZE_CHANGED: 'Changed page size to {size} records per page.',
        WELCOME_BACK: 'Welcome back, {name}!',
        LOGGING_IN: 'Logging in...'
    },
    WARNING: {
        FIRST_NAME_REQUIRED: 'Please enter at least the first name to search.',
        EPIC_REQUIRED: 'Please enter an EPIC number to search.',
        MOBILE_REQUIRED: 'Please enter a mobile number to search.',
        ADDRESS_REQUIRED: 'Please enter an address to search.',
        SELECT_SEARCH_TYPE: 'Please select a search type.',
        SHARE_CANCELLED: 'Share cancelled by user.',
        NO_RESULTS: 'No voters found matching your search criteria. Try adjusting your search terms.'
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

// Validation Configuration
export const VALIDATION = {
    // Field Validation Rules
    RULES: {
        EPIC: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 10,
            PATTERN: /^[A-Z]{3}[0-9]{7}$/,
            REQUIRED: true
        },
        MOBILE: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 15,
            PATTERN: /^[6-9][0-9]{9}$/,
            REQUIRED: false
        },
        NAME: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 100,
            PATTERN: /^[a-zA-Z\s\u0900-\u097F]+$/,
            REQUIRED: true
        },
        AGE: {
            MIN: 18,
            MAX: 120,
            REQUIRED: true
        },
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            REQUIRED: true
        },
        PASSWORD: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 50,
            REQUIRED: true
        }
    },
    
    // Validation Messages Templates
    MESSAGES: {
        REQUIRED: (field) => `${field} is required.`,
        MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters long.`,
        MAX_LENGTH: (field, max) => `${field} must not exceed ${max} characters.`,
        PATTERN: (field) => `${field} format is invalid.`,
        MIN_VALUE: (field, min) => `${field} must be at least ${min}.`,
        MAX_VALUE: (field, max) => `${field} must not exceed ${max}.`,
        INVALID_EMAIL: 'Please enter a valid email address.',
        INVALID_MOBILE: 'Please enter a valid 10-digit mobile number.',
        INVALID_EPIC: 'Please enter a valid EPIC number (e.g., ABC1234567).',
        INVALID_AGE: 'Please enter a valid age between 18 and 120.',
        PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
        PASSWORDS_NOT_MATCH: 'Passwords do not match.',
        FILE_TOO_LARGE: (maxSize) => `File size must not exceed ${maxSize}.`,
        INVALID_FILE_TYPE: (allowedTypes) => `Only ${allowedTypes.join(', ')} files are allowed.`,
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
        DUPLICATE_ENTRY: (field) => `${field} already exists.`,
        NOT_FOUND: (item) => `${item} not found.`,
        OPERATION_FAILED: (operation) => `${operation} failed. Please try again.`
    }
};

// Table Configuration
export const TABLE_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    SEARCH_PLACEHOLDER: 'Search by name, EPIC, mobile, or address...',
    MAX_RECORDS_PER_PAGE: 100,
    LOADING_DELAY: 300, // milliseconds
    DEBOUNCE_DELAY: 500 // milliseconds for search input
};

// Search Configuration
export const SEARCH_CONFIG = {
    TYPES: {
        NAME: 'name',
        EPIC: 'epic',
        MOBILE: 'mobile'
    },
    
    LABELS: {
        NAME: 'Name',
        EPIC: 'EPIC',
        MOBILE: 'Mobile'
    },
    
    PLACEHOLDERS: {
        FIRST_NAME: 'Enter first name',
        MIDDLE_NAME: 'Enter middle name',
        SURNAME: 'Enter surname',
        EPIC: 'Enter EPIC number',
        MOBILE: 'Enter mobile number'
    },
    
    MIN_SEARCH_LENGTH: {
        NAME: 2,
        EPIC: 3,
        MOBILE: 10,
    },
    
    DEFAULT_LIMIT: 16,
    MAX_RESULTS: 1000
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
    },
    TABS: {
        UPLOAD: 'upload',
        DATABASE: 'database'
    }
};

// Routes Configuration
export const ROUTES = {
    // Public Routes
    HOME: '/',
    SEARCH: '/',
    RESULTS: '/results',
    
    // Admin Routes
    ADMIN: {
        LOGIN: '/admin/login',
        DASHBOARD: '/admin/dashboard',
        UPLOAD: '/admin/dashboard?tab=upload',
        DATABASE: '/admin/dashboard?tab=database'
    },
    
    // External Routes
    EXTERNAL: {
        WHATSAPP_WEB: 'https://web.whatsapp.com/',
        WHATSAPP_SHARE: (mobile, message) => `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`
    }
};

// API Endpoints Configuration (relative to base URL)
export const API_ENDPOINTS = {
    // Public API Endpoints
    PUBLIC: {
        SEARCH: '/api/search',
        DOWNLOAD_PDF: (voterId) => `/api/download-pdf/${voterId}`,
        SHARE_IMAGE: (voterId) => `/api/share/${voterId}`,
        GENERATE_PDF: '/api/generate-pdf',
        WHATSAPP_SHARE: '/api/whatsapp-share'
    },
    
    // Admin API Endpoints
    ADMIN: {
        AUTH: {
            LOGIN: '/api/admin/auth/login',
            LOGOUT: '/api/admin/auth/logout',
            VERIFY: '/api/admin/auth/verify',
            REFRESH: '/api/admin/auth/refresh'
        },
        DATA: {
            UPLOAD_CSV: '/api/admin/upload-csv',
            GET_VOTERS: '/api/admin/get-voters',
            DELETE_VOTER: (voterId) => `/api/admin/voters/${voterId}`,
            UPDATE_VOTER: (voterId) => `/api/admin/voters/${voterId}`,
            EXPORT_CSV: '/api/admin/export-csv',
            GET_STATS: '/api/admin/stats'
        }
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

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

// Error Types
export const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTHENTICATION: 'AUTH_ERROR',
    AUTHORIZATION: 'AUTHORIZATION_ERROR',
    SERVER: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    FILE_UPLOAD: 'FILE_UPLOAD_ERROR',
    SYSTEM_PERMISSION: 'SYSTEM_PERMISSION_ERROR'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ADMIN_TOKEN: 'adminToken',
    ADMIN_USER: 'adminUser',
    SEARCH_HISTORY: 'searchHistory',
    USER_PREFERENCES: 'userPreferences',
    THEME: 'theme',
    LANGUAGE: 'language'
};

// Feature Flags
export const FEATURES = {
    WHATSAPP_SHARE: 'WHATSAPP_SHARE',
    PDF_DOWNLOAD: 'PDF_DOWNLOAD',
    PAGINATION: 'PAGINATION',
    EXPORT_CSV: 'EXPORT_CSV',
    DARK_MODE: 'DARK_MODE',
    MULTI_LANGUAGE: 'MULTI_LANGUAGE',
    SEARCH_HISTORY: 'SEARCH_HISTORY',
    ADVANCED_SEARCH: 'ADVANCED_SEARCH'
};

// Default export for easy importing
const CONSTANTS = {
    VOTER_FIELDS,
    UPLOAD_CONFIG,
    UI_MESSAGES,
    VALIDATION,
    TABLE_CONFIG,
    SEARCH_CONFIG,
    MODAL_CONFIG,
    ADMIN_CONFIG,
    ROUTES,
    API_ENDPOINTS,
    SAMPLE_CSV,
    COLORS,
    BREAKPOINTS,
    HTTP_STATUS,
    ERROR_TYPES,
    STORAGE_KEYS,
    FEATURES
};

export default CONSTANTS;