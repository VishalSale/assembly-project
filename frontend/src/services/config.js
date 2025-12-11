// API Configuration using environment variables

export const API_CONFIG = {
  // API Base URL from environment
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost/voter-app-react/backend/api',
  
  // Timeout in milliseconds
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 16,
  MAX_PAGE_SIZE: parseInt(process.env.REACT_APP_MAX_PAGE_SIZE) || 100,
};

export const APP_CONFIG = {
  // App name from environment
  APP_NAME: process.env.REACT_APP_NAME || 'Kagal Voter Information System',
  
  // Constituency names from environment
  CONSTITUENCY: process.env.REACT_APP_CONSTITUENCY_MARATHI || 'कागल विधान सभा 2024',
  CONSTITUENCY_ENG: process.env.REACT_APP_CONSTITUENCY_ENGLISH || 'Kagal Assembly Constituency 2024',
  
  // Feature flags from environment
  FEATURES: {
    WHATSAPP_SHARE: process.env.REACT_APP_ENABLE_WHATSAPP_SHARE === 'true',
    PDF_DOWNLOAD: process.env.REACT_APP_ENABLE_PDF_DOWNLOAD === 'true',
    PAGINATION: process.env.REACT_APP_ENABLE_PAGINATION === 'true',
  },
  
  // Theme colors from environment
  THEME: {
    PRIMARY_COLOR: process.env.REACT_APP_PRIMARY_COLOR || '#667eea',
    SECONDARY_COLOR: process.env.REACT_APP_SECONDARY_COLOR || '#764ba2',
    SUCCESS_COLOR: process.env.REACT_APP_SUCCESS_COLOR || '#4ade80',
    ERROR_COLOR: process.env.REACT_APP_ERROR_COLOR || '#f87171',
    WHATSAPP_COLOR: process.env.REACT_APP_WHATSAPP_COLOR || '#25d366',
  },
  
  // Debug mode
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
};

export default API_CONFIG;
