import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1 className="banner-title">कागल विधान सभा 2024</h1>
        <h2 className="banner-subtitle">Kagal Assembly Constituency</h2>
        <p className="banner-description">Voter Information System</p>
      </div>
    </div>
  );
};

export default Banner;
