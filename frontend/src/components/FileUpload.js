import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    // Validate file type
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      setUploadStatus('error');
      setSelectedFile(null);
      alert('Please select a valid CSV file only.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      // Get token from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setSelectedFile(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Show detailed results
        alert(`Upload successful!\n\nSummary:\n- Total CSV rows: ${result.data.total_rows_in_csv}\n- Processed: ${result.data.total_processed}\n- Inserted: ${result.data.inserted}\n- Updated: ${result.data.updated}\n- Errors: ${result.data.errors}\n- Skipped: ${result.data.skipped}`);
      } else {
        setUploadStatus('error');
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <div className="upload-header">
        <h2>Upload CSV File</h2>
        <p>Select or drag and drop a CSV file to upload voter data</p>
      </div>

      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div className="upload-placeholder">
            <FiUpload className="upload-icon" />
            <h3>Choose CSV file or drag it here</h3>
            <p>Only CSV files are allowed</p>
            <button type="button" className="browse-button">
              Browse Files
            </button>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <FiFile className="file-icon" />
              <div className="file-details">
                <h4>{selectedFile.name}</h4>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>
              <button 
                type="button" 
                className="remove-file"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <FiX />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-actions">
          <button 
            className="upload-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="spinner"></div>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload />
                Upload File
              </>
            )}
          </button>
        </div>
      )}

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus}`}>
          {uploadStatus === 'success' ? (
            <>
              <FiCheck className="status-icon" />
              <span>File uploaded successfully!</span>
            </>
          ) : (
            <>
              <FiAlertCircle className="status-icon" />
              <span>Upload failed. Please try again.</span>
            </>
          )}
        </div>
      )}

      <div className="upload-info">
        <h3>File Requirements:</h3>
        <ul>
          <li>File format: CSV only</li>
          <li>Maximum file size: 10MB</li>
          <li>Required columns: Name, EPIC, Age, Gender, Address, etc.</li>
          <li>Ensure data is properly formatted</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;