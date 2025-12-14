import React from 'react';
import { FiUser, FiUpload, FiLogOut, FiMail, FiDatabase, FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ user, onLogout, activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    {
      id: 'upload',
      label: 'Upload Data',
      icon: <FiUpload />,
      description: 'Upload CSV files'
    },
    {
      id: 'database',
      label: 'Voter Database',
      icon: <FiDatabase />,
      description: 'View voter records'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Close Button */}
        <button className="sidebar-close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <FiUser />
            </div>
            <div className="logo-text">
              <h2>Admin Panel</h2>
              <p>कागल विधान सभा</p>
            </div>
          </div>
        </div>

        <div className="user-profile">
          <div className="avatar">
            <img 
              src={user.avatar || '/images/default-avatar.png'} 
              alt="User Avatar"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMkU4RjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTIwIDIxVjE5QTQgNCAwIDAgMCAxNiAxNUg4QTQgNCAwIDAgMCA0IDE5VjIxIiBzdHJva2U9IiM0QTU1NjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSIjNEE1NTY4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+';
              }}
            />
            <div className="status-indicator"></div>
          </div>
          <div className="user-info">
            <div className="user-role">
              <span className="role-badge">{user.role}</span>
            </div>
            {/* <h3>{user.name}</h3> */}
            <div className="user-email">
              <FiMail className="email-icon" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <h4>Navigation</h4>
            {menuItems.map(item => (
              <div 
                key={item.id}
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth <= 768) {
                    onClose();
                  }
                }}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-content">
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-description">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={onLogout}>
            <FiLogOut className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;