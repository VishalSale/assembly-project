import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { adminApi } from '../services/adminApi';
import UploadResultModal from './UploadResultModal';
import { VOTER_FIELDS, UPLOAD_CONFIG, UI_MESSAGES, SAMPLE_CSV } from '../constants';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess, onViewData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [dragActive, setDragActive] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    // Validate file type using constants
    if (file && UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      setUploadStatus('error');
      setSelectedFile(null);
      alert(UI_MESSAGES.ERROR.INVALID_FILE);
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
      const result = await adminApi.uploadCsv(selectedFile);

      if (result.success) {
        // Show custom modal with detailed results FIRST
        setUploadResult(result);
        setShowResultModal(true);
        
        // Update status but keep file selected until modal is closed
        setUploadStatus('success');
        
        // Notify parent component about successful upload
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        // Show error in modal instead of alert
        setUploadResult(result);
        setShowResultModal(true);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      
      if (error.requiresLogin) {
        alert('Session expired. Please login again.');
        window.location.href = '/admin/login';
      } else {
        // Show error in modal instead of alert
        const errorResult = {
          success: false,
          message: error.message || 'Upload failed. Please check your connection and try again.',
          error: error.message,
          details: error.details || 'Check your CSV file format and try again.'
        };
        setUploadResult(errorResult);
        setShowResultModal(true);
      }
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

  const handleCloseModal = () => {
    setShowResultModal(false);
    setUploadResult(null);
    
    // Reset file selection when modal is closed
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
        <h2>{UI_MESSAGES.UPLOAD.TITLE}</h2>
        <p>{UI_MESSAGES.UPLOAD.DESCRIPTION}</p>
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
          accept={UPLOAD_CONFIG.ACCEPTED_FILE_TYPES}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div className="upload-placeholder">
            <FiUpload className="upload-icon" />
            <h3>{UI_MESSAGES.UPLOAD.DRAG_TEXT}</h3>
            <p>{UI_MESSAGES.UPLOAD.FILE_TYPE_TEXT}</p>
            <button type="button" className="browse-button">
              {UI_MESSAGES.UPLOAD.BROWSE_TEXT}
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
                {UI_MESSAGES.UPLOAD.UPLOADING}
              </>
            ) : (
              <>
                <FiUpload />
                {UI_MESSAGES.UPLOAD.UPLOAD_BUTTON}
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
              <span>{UI_MESSAGES.SUCCESS.UPLOAD_SUCCESS}</span>
            </>
          ) : (
            <>
              <FiAlertCircle className="status-icon" />
              <span>{UI_MESSAGES.ERROR.UPLOAD_FAILED}</span>
            </>
          )}
        </div>
      )}

      <div className="upload-info">
        <h3>{UI_MESSAGES.REQUIREMENTS.TITLE}</h3>
        <ul>
          <li><strong>File format:</strong> {UI_MESSAGES.REQUIREMENTS.FILE_FORMAT}</li>
          <li><strong>Maximum file size:</strong> {UPLOAD_CONFIG.MAX_FILE_SIZE_TEXT}</li>
          <li><strong>{UI_MESSAGES.REQUIREMENTS.CASE_SENSITIVE}</strong></li>
        </ul>

        <div className="field-requirements">
          <h4>{UI_MESSAGES.REQUIREMENTS.REQUIRED_FIELDS_TITLE}</h4>
          <div className="field-list required">
            {VOTER_FIELDS.REQUIRED.map(field => (
              <code key={field}>{field}</code>
            ))}
          </div>

          <h4>{UI_MESSAGES.REQUIREMENTS.OPTIONAL_FIELDS_TITLE}</h4>
          <div className="field-list optional">
            {VOTER_FIELDS.OPTIONAL.map(field => (
              <code key={field}>{field}</code>
            ))}
          </div>
        </div>
        
        <div className="sample-format">
          <h4>{UI_MESSAGES.REQUIREMENTS.SAMPLE_FORMAT_TITLE}</h4>
          <code>
            {SAMPLE_CSV.HEADERS}<br/>
            {SAMPLE_CSV.ROWS.map((row, index) => (
              <React.Fragment key={index}>
                {row}<br/>
              </React.Fragment>
            ))}
          </code>
        </div>

        <div className="validation-notes">
          <h4>{UI_MESSAGES.REQUIREMENTS.VALIDATION_NOTES_TITLE}</h4>
          <ul>
            {UI_MESSAGES.REQUIREMENTS.VALIDATION_NOTES.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upload Result Modal */}
      <UploadResultModal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        uploadResult={uploadResult}
        onViewData={onViewData}
      />
    </div>
  );
};

export default FileUpload;