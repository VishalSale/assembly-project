import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { adminApi } from '../services/adminApi';
import { showSuccess, showError, showAuthError } from '../services/toastService';
import { UI_MESSAGES, ROUTES } from '../constants';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminApi.login(formData.email, formData.password);

      if (result.success) {
        showSuccess(UI_MESSAGES.SUCCESS.LOGIN_SUCCESS);
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        const errorMessage = result.message || UI_MESSAGES.ERROR.LOGIN_FAILED;
        setError(errorMessage);
        showAuthError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || UI_MESSAGES.ERROR.LOGIN_FAILED;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Full-width Poster at the top */}
      <div className="poster-section">
        <img 
          src="/images/poster.jpeg"
          alt="Kagal Constituency Poster" 
          className="poster-image"
          onError={(e) => {
            const extensions = ['jpg', 'png', 'gif', 'webp'];
            const currentSrc = e.target.src;
            
            for (const ext of extensions) {
              const newSrc = `/images/poster.${ext}`;
              if (!currentSrc.includes(ext)) {
                e.target.src = newSrc;
                return;
              }
            }
            e.target.style.display = 'none';
          }}
        />
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>कागल विधान सभा - Admin Panel</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? UI_MESSAGES.INFO.LOGGING_IN : 'Login'}
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@gmail.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;