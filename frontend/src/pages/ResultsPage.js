import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchVoters } from '../services/api';
import { showError, showInfo, showSuccess } from '../services/toastService';
import VoterCard from '../components/VoterCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowLeft } from 'react-icons/fi';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 16
  });

  const { searchType, searchData } = location.state || {};

  useEffect(() => {
    if (!searchType || !searchData) {
      navigate('/');
      return;
    }
    setIsInitialSearch(true);
    fetchVoters(1);
  }, [searchType, searchData]);

  const fetchVoters = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchVoters(searchType, searchData, page);
      setVoters(response.data);
      setPagination(response.pagination);
      
      // Show success toast with results count ONLY on initial search
      if (isInitialSearch) {
        if (response.data.length > 0) {
          showSuccess(`Found ${response.pagination.totalRecords} voter${response.pagination.totalRecords !== 1 ? 's' : ''} matching your search.`);
        } else {
          showInfo('No voters found matching your search criteria. Try adjusting your search terms.');
        }
        setIsInitialSearch(false);
      }
    } catch (err) {
      const errorMessage = err.error || 'Failed to fetch voters';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchVoters(page);
    showInfo(`Loading page ${page}...`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="results-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <button className="back-button" onClick={handleBackToSearch}>
          <FiArrowLeft /> Back to Search
        </button>
        <h1>Search Results</h1>
        <p className="results-count">
          Found {pagination.totalRecords} voter{pagination.totalRecords !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="results-container">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleBackToSearch}>Try Again</button>
          </div>
        )}

        {!error && voters.length === 0 && (
          <div className="no-results">
            <h2>No voters found</h2>
            <p>Try adjusting your search criteria</p>
            <button onClick={handleBackToSearch}>Back to Search</button>
          </div>
        )}

        {!error && voters.length > 0 && (
          <>
            <div className="voters-grid">
              {voters.map((voter, index) => (
                <VoterCard key={voter.id} voter={voter} index={index} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
