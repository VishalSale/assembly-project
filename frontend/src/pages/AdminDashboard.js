import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FileUpload from '../components/FileUpload';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      navigate('/admin/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="main-content">
        <div className="content-header">
          <h1>Upload Voter Data</h1>
          <p>Upload CSV files to update the voter database</p>
        </div>
        
        <div className="upload-section">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;