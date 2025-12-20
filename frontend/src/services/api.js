import axios from 'axios';
import { API_CONFIG } from './config';
import { showNetworkError, showSessionExpired, showError } from './toastService';

// Use API_BASE_URL from config
const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor to handle systemPermission middleware errors
api.interceptors.response.use(
  // Success response - pass through
  (response) => response,
  
  // Error response - handle systemPermission and other errors globally
  (error) => {
    // Handle systemPermission middleware errors (503 status)
    if (error.response?.status === 503) {
      const backendMessage = error.response?.data?.message || 'System is temporarily unavailable';
      
      // Show toast for system permission error
      showError(backendMessage);
      
      // Create a new error with the backend message
      const systemPermissionError = new Error(backendMessage);
      systemPermissionError.isSystemPermissionError = true;
      systemPermissionError.statusCode = 503;
      systemPermissionError.response = error.response;
      
      return Promise.reject(systemPermissionError);
    }
    
    // Handle authentication errors (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      showSessionExpired();
    }
    
    // Handle network errors
    if (!error.response) {
      showNetworkError();
    }
    
    // Handle other HTTP errors - preserve backend error messages
    if (error.response?.data?.message) {
      const backendMessage = error.response.data.message;
      const backendError = new Error(backendMessage);
      backendError.statusCode = error.response.status;
      backendError.response = error.response;
      
      return Promise.reject(backendError);
    }
    
    // Pass through other errors unchanged
    return Promise.reject(error);
  }
);

export const searchVoters = async (searchType, searchData, page = 1, limit = 16) => {
  try {
    // Map frontend search data to backend format
    let searchQuery = '';
    
    switch (searchType) {
      case 'name':
        // Combine name parts for full_name search
        const nameParts = [
          searchData.firstname?.trim(),
          searchData.middlename?.trim(), 
          searchData.surname?.trim()
        ].filter(Boolean);
        searchQuery = nameParts.join(' ');
        break;
      case 'epic':
        searchQuery = searchData.epic?.trim();
        break;
      case 'mobile':
        searchQuery = searchData.mobile?.trim();
        break;
      case 'address':
        searchQuery = searchData.address?.trim();
        break;
      default:
        throw { error: 'Invalid search type' };
    }

    if (!searchQuery) {
      throw { error: 'Search query is required' };
    }

    const params = {
      type: searchType === 'epic' ? 'epic' : searchType === 'mobile' ? 'mobile' : searchType === 'address' ? 'address' : 'name',
      query: searchQuery,
      page,
      limit
    };

    const response = await api.get('/api/search', { params });
    
    // Check if response is valid JSON with expected structure
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data);
      throw { error: 'Invalid response from server' };
    }
    
    return response.data;
  } catch (error) {
    console.error('Search API Error:', error);
    
    // Handle systemPermission errors (handled by global interceptor)
    if (error.isSystemPermissionError) {
      throw { error: error.message, isSystemPermissionError: true };
    }
    
    // Handle other backend errors (handled by global interceptor)
    if (error.statusCode) {
      throw { error: error.message, statusCode: error.statusCode };
    }
    
    // If it's a network error (no response received)
    if (!error.response) {
      throw { error: 'System is temporarily unavailable' };
    }
    
    // If server returned an error
    if (error.response?.data) {
      throw error.response.data;
    }
    
    // Generic error
    throw { error: error.message || 'An error occurred' };
  }
};

export const getDownloadPdfUrl = (voterId) => {
  return `${API_BASE_URL}/api/download-pdf/${voterId}`;
};

export const getWhatsAppUrl = (mobile, voterData) => {
  const message = `
*Voter Information*
Name: ${voterData.full_name || 'N/A'}
EPIC: ${voterData.epic_no || 'N/A'}
Serial No: ${voterData.serial_no || 'N/A'}
Booth: ${voterData.booth_no || 'N/A'}
Ward: ${voterData.ward_no || 'N/A'}
Mobile: ${voterData.mobile || 'N/A'}
Address: ${voterData.new_address || 'N/A'}
  `.trim();

  return `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
};

export default api;
