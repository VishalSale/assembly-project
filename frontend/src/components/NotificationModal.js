import React from 'react';
import { FiX, FiInfo, FiCheckCircle, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, type = 'info', title, message, buttonText = 'Got it' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle />;
      case 'error':
        return <FiAlertCircle />;
      case 'warning':
        return <FiAlertTriangle />;
      default:
        return <FiInfo />;
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="notification-modal-overlay" onClick={handleOverlayClick}>
      <div className="notification-modal">
        <div className="notification-header">
          <div className="notification-icon-container">
            <div className={`notification-icon ${type}`}>
              {getIcon()}
            </div>
            <div className="notification-text">
              <h3>{title}</h3>
              <p>{message}</p>
            </div>
          </div>
          <button className="notification-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="notification-footer">
          <button className={`notification-button ${type}`} onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;