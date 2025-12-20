import React, { useState } from 'react';
import { FiUser, FiCreditCard, FiPhone, FiMapPin, FiSearch } from 'react-icons/fi';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [activeTab, setActiveTab] = useState('name');
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    surname: '',
    epic: '',
    mobile: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let searchData = {};
    switch (activeTab) {
      case 'name':
        searchData = {
          firstname: formData.firstname,
          middlename: formData.middlename,
          surname: formData.surname
        };
        break;
      case 'epic':
        searchData = { epic: formData.epic };
        break;
      case 'mobile':
        searchData = { mobile: formData.mobile };
        break;
      case 'address':
        searchData = { address: formData.address };
        break;
      default:
        break;
    }

    onSearch(activeTab, searchData);
  };

  const tabs = [
    { id: 'name', label: 'Name', icon: <FiUser /> },
    { id: 'epic', label: 'EPIC', icon: <FiCreditCard /> },
    { id: 'mobile', label: 'Mobile', icon: <FiPhone /> },
    // { id: 'address', label: 'Address', icon: <FiMapPin /> }
  ];

  return (
    <div className="search-form-container">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        {activeTab === 'name' && (
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="firstname">First Name *</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="middlename">Middle Name</label>
              <input
                type="text"
                id="middlename"
                name="middlename"
                value={formData.middlename}
                onChange={handleInputChange}
                placeholder="Enter middle name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="Enter surname"
              />
            </div>
          </div>
        )}

        {activeTab === 'epic' && (
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="epic">EPIC / Voter ID Number *</label>
              <input
                type="text"
                id="epic"
                name="epic"
                value={formData.epic}
                onChange={handleInputChange}
                placeholder="Enter EPIC number"
                required
              />
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>
        )}

        {/* {activeTab === 'address' && (
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                required
              />
            </div>
          </div>
        )} */}

        <button type="submit" className="submit-button" disabled={loading}>
          <FiSearch />
          <span>{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
