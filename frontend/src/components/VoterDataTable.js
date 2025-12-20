import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiSearch, FiDownload, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { adminApi } from '../services/adminApi';
import { showSuccess, showError, showInfo, showSessionExpired } from '../services/toastService';
import NotificationModal from './NotificationModal';
import { UI_MESSAGES, TABLE_CONFIG } from '../constants';
import './VoterDataTable.css';

const VoterDataTable = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(TABLE_CONFIG.DEFAULT_PAGE_SIZE);
  const [showNotification, setShowNotification] = useState(false);

  // Fetch voter data
  const fetchVoterData = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminApi.getVoterData(page, limit);

      if (result.success) {
        setVoters(result.data || []);

        // Use the new pagination structure from backend
        if (result.pagination) {
          setCurrentPage(result.pagination.currentPage);
          setTotalPages(result.pagination.totalPages);
          setTotalRecords(result.pagination.totalRecords);
        } else {
          // Fallback for old structure
          setTotalRecords(result.data?.length || 0);
          setTotalPages(1);
          setCurrentPage(1);
        }

        // Show success toast
        showSuccess(`Loaded ${result.data?.length || 0} voter records successfully.`);
      } else {
        const errorMessage = result.message || 'Failed to fetch voter data';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Fetch voter data error:', err);
      const errorMessage = err.message || 'Failed to fetch voter data';
      setError(errorMessage);
      showError(errorMessage);

      if (err.requiresLogin) {
        showSessionExpired();
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVoterData(1);
  }, [limit]); // Refetch when limit changes

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      showInfo(`Loading page ${page}...`);
      fetchVoterData(page);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    showInfo('Refreshing voter data...');
    fetchVoterData(currentPage);
  };

  // Filter voters based on search term
  const filteredVoters = voters.filter(voter => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      voter.full_name?.toLowerCase().includes(searchLower) ||
      voter.epic_no?.toLowerCase().includes(searchLower) ||
      voter.mobile?.toLowerCase().includes(searchLower) ||
      voter.new_address?.toLowerCase().includes(searchLower)
    );
  });

  // Handle export (placeholder for future implementation)
  const handleExport = () => {
    setShowNotification(true);
    showInfo('Export feature will be available soon!');
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  // Handle page size change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing page size
    showInfo(`Changed page size to ${newLimit} records per page.`);
  };

  if (loading) {
    return (
      <div className="voter-data-table">
        <div className="loading-state">
          <FiRefreshCw className="loading-icon" />
          <p>Loading voter data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voter-data-table">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-data-table">
      <div className="table-header">
        <div className="header-left">
          <h2>Voter Database</h2>
          <p className="record-count">Total Records: {totalRecords}</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={TABLE_CONFIG.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="page-size-selector">
            <label htmlFor="pageSize">Show:</label>
            <select
              id="pageSize"
              value={limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="page-size-select"
            >
              {TABLE_CONFIG.PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <button onClick={handleRefresh} className="action-button refresh-btn">
            <FiRefreshCw />
            Refresh
          </button>

          <button onClick={handleExport} className="action-button export-btn">
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {filteredVoters.length === 0 ? (
        <div className="empty-state">
          <FiEye className="empty-icon" />
          <h3>No voter data found</h3>
          <p>Upload a CSV file to see voter records here.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="voter-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>EPIC No</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Ward</th>
                  <th>Booth</th>
                  <th>Municipality</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter) => (
                  <tr key={voter.id}>
                    <td>{voter.id}</td>
                    <td className="name-cell">
                      <strong>{voter.full_name || 'N/A'}</strong>
                    </td>
                    <td className="epic-cell">{voter.epic_no || 'N/A'}</td>
                    <td>{voter.age || 'N/A'}</td>
                    <td>
                      <span className={`gender-badge ${voter.gender?.toLowerCase()}`}>
                        {voter.gender || 'N/A'}
                      </span>
                    </td>
                    <td>{voter.mobile || 'N/A'}</td>
                    <td>{voter.ward_no || 'N/A'}</td>
                    <td>{voter.booth_no || 'N/A'}</td>
                    <td>{voter.municipality || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <FiChevronLeft />
                Previous
              </button>

              <div className="pagination-info">
                <div className="page-info">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
                <div className="records-info">
                  <span>
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} records
                  </span>
                </div>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          )}

          {totalPages <= 1 && totalRecords > 0 && (
            <div className="pagination-summary">
              <span>Showing all {totalRecords} records</span>
            </div>
          )}
        </>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={closeNotification}
        type="info"
        title={UI_MESSAGES.EXPORT.TITLE}
        message={UI_MESSAGES.EXPORT.MESSAGE}
        buttonText={UI_MESSAGES.EXPORT.BUTTON_TEXT}
      />
    </div>
  );
};

export default VoterDataTable;