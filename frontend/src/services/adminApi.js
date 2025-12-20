import { API_CONFIG } from './config';
import api from './api'; // Import the shared axios instance with global interceptors

// Admin API service for handling authentication and admin operations
class AdminApiService {
  
  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Login admin user
  async login(email, password) {
    try {
      const response = await api.post('/api/admin/auth/login', { email, password });
      
      if (response.data.success) {
        // Store user data and token
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name || 'Admin User',
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: '/images/admin-avatar.png'
        };
        
        localStorage.setItem('adminUser', JSON.stringify(userData));
        localStorage.setItem('adminToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle systemPermission and other backend errors (handled by global interceptor)
      if (error.isSystemPermissionError || error.statusCode) {
        throw { success: false, message: error.message, isSystemPermissionError: error.isSystemPermissionError };
      }
      
      // Handle axios errors
      if (error.response?.data) {
        throw { success: false, message: error.response.data.message || 'Login failed' };
      }
      
      // Handle network errors
      throw { success: false, message: error.message || 'Network error. Please try again.' };
    }
  }

  // Logout admin user
  async logout() {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        await api.post('/api/admin/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    }
  }

  // Upload CSV file
  async uploadCsv(file) {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw { success: false, message: 'Authentication required' };
      }

      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Parse response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error(`Server error (${response.status}): ${response.statusText}`);
      }
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        throw { success: false, message: result.message || 'Session expired. Please login again.', requiresLogin: true };
      }
      
      // Handle systemPermission and other errors
      if (!response.ok) {
        const errorMessage = result.message || `Server error (${response.status}): ${response.statusText}`;
        const error = new Error(errorMessage);
        error.statusCode = response.status;
        if (response.status === 503) {
          error.isSystemPermissionError = true;
        }
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error('CSV upload error:', error);
      
      // Handle specific error types
      if (error.requiresLogin) {
        throw error;
      }
      
      // Preserve systemPermission and other backend errors
      if (error.isSystemPermissionError || error.statusCode) {
        throw { success: false, message: error.message, isSystemPermissionError: error.isSystemPermissionError };
      }
      
      // If it's already a structured error response, preserve it
      if (error.success !== undefined) {
        throw error;
      }
      
      // Handle network errors
      throw { success: false, message: error.message || 'Network error. Please check your connection and try again.' };
    }
  }

  // Get voter data (for admin dashboard)
  async getVoterData(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw { success: false, message: 'Authentication required', requiresLogin: true };
      }

      const response = await api.get(`/api/admin/get-voters?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        throw { success: false, message: 'Session expired. Please login again.', requiresLogin: true };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get voter data error:', error);
      
      // Handle specific error types
      if (error.requiresLogin) {
        throw error;
      }
      
      // Handle systemPermission and other backend errors (handled by global interceptor)
      if (error.isSystemPermissionError || error.statusCode) {
        throw { success: false, message: error.message, isSystemPermissionError: error.isSystemPermissionError };
      }
      
      // Handle axios errors
      if (error.response?.data) {
        throw { success: false, message: error.response.data.message || 'Failed to fetch voter data' };
      }
      
      // Handle network errors
      throw { success: false, message: error.message || 'Failed to fetch voter data.' };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('adminUser');
    return userData ? JSON.parse(userData) : null;
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();
export default adminApi;