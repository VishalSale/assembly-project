import { API_CONFIG } from './config';

const API_BASE_URL = API_CONFIG.BASE_URL;

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
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      
      if (result.success) {
        // Store user data and token
        const userData = {
          id: result.user.id,
          name: result.user.name || 'Admin User',
          email: result.user.email,
          role: result.user.role,
          avatar: '/images/admin-avatar.png'
        };
        
        localStorage.setItem('adminUser', JSON.stringify(userData));
        localStorage.setItem('adminToken', result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw { success: false, message: 'Network error. Please try again.' };
    }
  }

  // Logout admin user
  async logout() {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders()
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

      const response = await fetch(`${API_BASE_URL}/api/admin/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        throw { success: false, message: 'Session expired. Please login again.', requiresLogin: true };
      }
      
      // Return the result as-is (whether success or failure)
      // The frontend will handle both success and error cases
      return result;
    } catch (error) {
      console.error('CSV upload error:', error);
      
      // Handle specific error types
      if (error.requiresLogin) {
        throw error;
      }
      
      // If it's a JSON parsing error or network error
      if (error instanceof SyntaxError) {
        throw { success: false, message: 'Server response error. Please try again.' };
      }
      
      // If it's already a structured error response, preserve it
      if (error.success !== undefined) {
        throw error;
      }
      
      // Generic network error
      throw { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  }

  // Get voter data (for admin dashboard)
  async getVoterData(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw { success: false, message: 'Authentication required', requiresLogin: true };
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/get-voters?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        throw { success: false, message: 'Session expired. Please login again.', requiresLogin: true };
      }
      
      return result;
    } catch (error) {
      console.error('Get voter data error:', error);
      if (error.requiresLogin) {
        throw error;
      }
      throw { success: false, message: 'Failed to fetch voter data.' };
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