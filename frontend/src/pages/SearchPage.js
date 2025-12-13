import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchType, searchData) => {
    setLoading(true);
    // Navigate to results page with search params
    navigate('/results', {
      state: { searchType, searchData }
    });
  };

  return (
    <div className="search-page">
      {/* Full-width Poster at the top */}
      <div className="poster-section">
        <img 
          src="/images/poster.jpeg"
          alt="Kagal Constituency Poster" 
          className="poster-image"
          onError={(e) => {
            // Try different extensions if jpeg fails
            const extensions = ['jpg', 'png', 'gif', 'webp'];
            const currentSrc = e.target.src;
            
            for (const ext of extensions) {
              const newSrc = `/images/poster.${ext}`;
              if (!currentSrc.includes(ext)) {
                e.target.src = newSrc;
                return;
              }
            }
            
            // If all fail, hide the image
            e.target.style.display = 'none';
          }}
        />
      </div>

      <div className="search-container">
        <div className="search-content">
          <div className="search-header">
            <h1>कागल विधान सभा 2024</h1>
            <h2>Find Your Name in Voter List</h2>
            <p className="search-subtitle">
              Search by Name, EPIC Number, Mobile Number, or Address
            </p>
          </div>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;