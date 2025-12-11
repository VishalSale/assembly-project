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
    const params = {
      searchType,
      page,
      limit,
      ...searchData,
    };

    const response = await api.post('/search', params);
    
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
  return `${API_BASE_URL}/download-pdf/${voterId}`;
};

export const getWhatsAppUrl = (mobile, voterData) => {
  const fullName = `${voterData.firstNameEng || ''} ${voterData.middleNameEng || ''} ${voterData.surnameEng || ''}`.trim();
  const message = `
*Voter Information*
Name: ${fullName}
EPIC: ${voterData.epic || 'N/A'}
Serial No: ${voterData.serialNo || voterData.srNo || 'N/A'}
Booth: ${voterData.booth || 'N/A'}
Mobile: ${voterData.mobile || 'N/A'}
Address: ${voterData.address || 'N/A'}
  `.trim();

  return `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
};

export default api;
