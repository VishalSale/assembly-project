import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiDatabase, FiUsers, FiMenu, FiBell, FiSettings } from 'react-icons/fi';
import { showSuccess, showError, showInfo, showSessionExpired } from '../services/toastService';
import Sidebar from '../components/Sidebar';
import FileUpload from '../components/FileUpload';
import VoterDataTable from '../components/VoterDataTable';
import { adminApi } from '../services/adminApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!adminApi.isAuthenticated()) {
      showSessionExpired();
      navigate('/admin/login');
      return;
    }
    
    const userData = adminApi.getCurrentUser();
    setUser(userData);
    showInfo(`Welcome back, ${userData?.name || 'Admin'}!`);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      showSuccess('Logged out successfully. See you next time!');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Logout failed, but redirecting anyway.');
      // Still redirect even if logout API fails
      navigate('/admin/login');
    }
  };

  const handleUploadSuccess = (uploadData) => {
    // Don't switch tabs immediately - let user see the success modal first
    // The modal will handle the user experience
    
    // Trigger refresh of voter data table for when user switches to database tab
    setRefreshTrigger(prev => prev + 1);
    
    // Show additional toast for quick feedback
    showSuccess(`Upload completed! ${uploadData.total_processed || 0} records processed.`);
  };

  const handleViewUploadedData = () => {
    // Switch to database tab to show the uploaded data
    setActiveTab('database');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="admin-dashboard">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'upload',
      label: 'Upload Data',
      icon: <FiUpload />,
      description: 'Upload CSV files to update the voter database'
    },
    {
      id: 'database',
      label: 'Voter Database',
      icon: <FiDatabase />,
      description: 'View and manage voter records'
    }
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <div className="main-content">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <div className="mobile-title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="mobile-actions">
            {/* <button className="action-btn">
              <FiBell />
            </button>
            <button className="action-btn">
              <FiSettings />
            </button> */}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header">
          <div className="header-info">
            <h1>Admin Dashboard</h1>
            <p>Manage voter data and system settings</p>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <FiUsers className="user-icon" />
              <span>Welcome, {user.name}</span>
            </div>
            <div className="action-buttons">
              {/* <button className="action-btn">
                <FiBell />
              </button>
              <button className="action-btn">
                <FiSettings />
              </button> */}
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="content-tabs">
            <div className="tab-navigation">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="tab-content">
              <div className="tab-header">
                <h2>{tabs.find(tab => tab.id === activeTab)?.label}</h2>
                <p>{tabs.find(tab => tab.id === activeTab)?.description}</p>
              </div>
              
              {activeTab === 'upload' && (
                <div className="upload-section">
                  <FileUpload 
                    onUploadSuccess={handleUploadSuccess} 
                    onViewData={handleViewUploadedData}
                  />
                </div>
              )}
              
              {activeTab === 'database' && (
                <div className="database-section">
                  <VoterDataTable key={refreshTrigger} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;