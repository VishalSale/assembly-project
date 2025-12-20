import React from 'react';
import { FiX, FiCheckCircle, FiUpload, FiDatabase, FiAlertCircle, FiSkipForward } from 'react-icons/fi';
import './UploadResultModal.css';

const UploadResultModal = ({ isOpen, onClose, uploadResult, onViewData }) => {
  if (!isOpen || !uploadResult) return null;

  const isSuccess = uploadResult.success;
  const { data } = uploadResult;

  // Function to format error messages with bold invalid headers
  const formatErrorMessage = (message) => {
    if (!message) return message;

    // Pattern to match "Invalid headers: header1, header2, header3"
    const invalidHeadersPattern = /Invalid headers: ([^.]+)/;
    const match = message.match(invalidHeadersPattern);

    if (match) {
      const invalidHeaders = match[1];
      const beforeText = message.substring(0, match.index);
      const afterText = message.substring(match.index + match[0].length);
      
      // Split headers and make each one bold
      const headers = invalidHeaders.split(', ').map((header, index) => (
        <React.Fragment key={index}>
          {index > 0 && ', '}
          <strong className="invalid-header">{header.trim()}</strong>
        </React.Fragment>
      ));

      return (
        <>
          {beforeText}Invalid headers: {headers}{afterText}
        </>
      );
    }

    // Pattern to match "Missing: header1, header2"
    const missingHeadersPattern = /Missing: ([^.]+)/;
    const missingMatch = message.match(missingHeadersPattern);

    if (missingMatch) {
      const missingHeaders = missingMatch[1];
      const beforeText = message.substring(0, missingMatch.index);
      const afterText = message.substring(missingMatch.index + missingMatch[0].length);
      
      // Split headers and make each one bold
      const headers = missingHeaders.split(', ').map((header, index) => (
        <React.Fragment key={index}>
          {index > 0 && ', '}
          <strong className="missing-header">{header.trim()}</strong>
        </React.Fragment>
      ));

      return (
        <>
          {beforeText}Missing: {headers}{afterText}
        </>
      );
    }

    return message;
  };

  // Only show stats for successful uploads
  const stats = isSuccess ? [
    {
      label: 'Total CSV Rows',
      value: data.total_rows_in_csv,
      icon: <FiUpload />,
      color: 'blue'
    },
    {
      label: 'Successfully Processed',
      value: data.total_processed,
      icon: <FiCheckCircle />,
      color: 'green'
    },
    {
      label: 'New Records Inserted',
      value: data.inserted,
      icon: <FiDatabase />,
      color: 'blue'
    },
    {
      label: 'Existing Records Updated',
      value: data.updated,
      icon: <FiDatabase />,
      color: 'orange'
    },
    {
      label: 'Records with Errors',
      value: data.errors,
      icon: <FiAlertCircle />,
      color: 'red'
    },
    {
      label: 'Records Skipped',
      value: data.skipped,
      icon: <FiSkipForward />,
      color: 'gray'
    }
  ] : [];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="upload-result-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className={`${isSuccess ? 'success' : 'error'}-icon`}>
              {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
            </div>
            <div className="header-text">
              <h2>{isSuccess ? 'Upload Successful!' : 'Upload Failed'}</h2>
              <p>{isSuccess ? 'Your CSV file has been processed successfully' : 'There was an issue with your CSV file'}</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <>
              <div className="summary-section">
                <h3>Processing Summary</h3>
                <p className="summary-text">{data.summary}</p>
              </div>

              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon">
                      {stat.icon}
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {data.errors > 0 && (
                <div className="error-notice">
                  <FiAlertCircle className="notice-icon" />
                  <div className="notice-content">
                    <h4>Some records had errors</h4>
                    <p>
                      {data.errors} record{data.errors !== 1 ? 's' : ''} could not be processed. 
                      Please check the server logs for detailed error information.
                    </p>
                  </div>
                </div>
              )}

              {data.skipped > 0 && (
                <div className="warning-notice">
                  <FiSkipForward className="notice-icon" />
                  <div className="notice-content">
                    <h4>Some records were skipped</h4>
                    <p>
                      {data.skipped} record{data.skipped !== 1 ? 's' : ''} were skipped due to missing required fields are one of these or all
                      (epic_no, full_name, age, gender).
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="error-section">
              <div className="error-message">
                <h3>Error Details</h3>
                <div className="error-content">
                  <p className="main-error">{formatErrorMessage(uploadResult.message)}</p>
                  {uploadResult.error && uploadResult.error !== uploadResult.message && (
                    <div className="detailed-error">
                      <h4>Technical Details:</h4>
                      <p>{formatErrorMessage(uploadResult.error)}</p>
                    </div>
                  )}
                  {/* {uploadResult.details && (
                    <div className="error-details">
                      <h4>Additional Information:</h4>
                      <p>{uploadResult.details}</p>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="fix-suggestions">
                <h4>How to fix this:</h4>
                <ul>
                  <li>Check that your CSV file has the exact field names (case-sensitive)</li>
                  <li>Required fields: <code>epic_no</code>, <code>full_name</code>, <code>age</code>, <code>gender</code></li>
                  <li>Make sure there are no extra spaces or special characters in field names</li>
                  <li>Verify your CSV file is properly formatted with commas as separators</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {isSuccess ? (
            <>
              <button className="secondary-button" onClick={onClose}>
                <FiCheckCircle />
                Got it, thanks!
              </button>
              
              <button 
                className="primary-button" 
                onClick={() => {
                  onClose();
                  if (onViewData) {
                    onViewData();
                  }
                }}
              >
                <FiDatabase />
                View Uploaded Data
              </button>
            </>
          ) : (
            <button className="primary-button error" onClick={onClose}>
              <FiAlertCircle />
              Close and Fix CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResultModal;