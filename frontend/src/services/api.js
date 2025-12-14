import axios from 'axios';
import { API_CONFIG } from './config';

// Use API_BASE_URL from config
const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.error('API Error:', error);
    
    // If it's a network error
    if (!error.response) {
      throw { error: 'Network error - Please check if backend is running' };
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
