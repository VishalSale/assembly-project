import React from 'react';
import { FiDownload, FiMessageCircle, FiUser, FiPhone, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { getDownloadPdfUrl, getWhatsAppUrl } from '../services/api';
import './VoterCard.css';

const VoterCard = ({ voter, index }) => {
  console.log('VoterCard rendering for voter:', voter.id);
  
  const handleDownload = () => {
    console.log('Download button clicked for voter:', voter.id);
    window.open(getDownloadPdfUrl(voter.id), '_blank');
  };

  const handleShare = async () => {
    console.log('Share button clicked for voter:', voter.id);
    try {
      const shareUrl = `${process.env.REACT_APP_API_BASE_URL}/share/${voter.id}`;
      console.log('Share URL:', shareUrl);
      
      // Check if Web Share API is supported
      if (navigator.share) {
        // Generate the share image first
        const response = await fetch(shareUrl);
        const blob = await response.blob();
        const file = new File([blob], `voter_${voter.id}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Voter Information - ${voter.firstNameEng} ${voter.surnameEng}`,
          text: `EPIC: ${voter.epic}\nBooth: ${voter.booth}\nSerial: ${voter.serialNo}`,
          files: [file]
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.href = shareUrl;
        link.download = `voter_${voter.id}_${voter.firstNameEng}_${voter.surnameEng}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback: Open share URL in new tab
      window.open(`${process.env.REACT_APP_API_BASE_URL}/share/${voter.id}`, '_blank');
    }
  };

  return (
    <div className="voter-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="voter-card-header">
        <div className="voter-icon">
          <FiUser />
        </div>
        <h3 className="voter-name">
          {voter.firstNameEng} {voter.middleNameEng} {voter.surnameEng}
        </h3>
        <p className="voter-name-marathi">
          {voter.firstName} {voter.middleName} {voter.surname}
        </p>
      </div>

      <div className="voter-card-body">
        <div className="voter-info-grid">
          <div className="info-item">
            <FiCreditCard className="info-icon" />
            <div>
              <span className="info-label">EPIC</span>
              <span className="info-value">{voter.epic || 'N/A'}</span>
            </div>
          </div>

          <div className="info-item">
            <FiUser className="info-icon" />
            <div>
              <span className="info-label">Age</span>
              <span className="info-value">{voter.age || 'N/A'}</span>
            </div>
          </div>

          <div className="info-item">
            <FiPhone className="info-icon" />
            <div>
              <span className="info-label">Mobile</span>
              <span className="info-value">{voter.mobile || 'N/A'}</span>
            </div>
          </div>

          <div className="info-item">
            <FiMapPin className="info-icon" />
            <div>
              <span className="info-label">Booth</span>
              <span className="info-value">{voter.booth || 'N/A'}</span>
            </div>
          </div>

          {voter.gender && (
            <div className="info-item">
              <FiUser className="info-icon" />
              <div>
                <span className="info-label">Gender</span>
                <span className="info-value">{voter.gender}</span>
              </div>
            </div>
          )}
        </div>

        <div className="voter-details">
          <div className="detail-section">
            <h4 className="section-title">Voting Information</h4>
            <div className="detail-row">
              <span className="detail-label">Serial No:</span>
              <span className="detail-value">{voter.srNo || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Part:</span>
              <span className="detail-value">{voter.part || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Part Name:</span>
              <span className="detail-value">{voter.partName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Booth Name:</span>
              <span className="detail-value">{voter.boothName || 'N/A'}</span>
            </div>
            {voter.eboothName && (
              <div className="detail-row">
                <span className="detail-label">Booth (Marathi):</span>
                <span className="detail-value">{voter.eboothName}</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4 className="section-title">Address Information</h4>
            <div className="detail-row">
              <span className="detail-label">House No:</span>
              <span className="detail-value">{voter.houseNo || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{voter.address || 'N/A'}</span>
            </div>
          </div>

          {(voter.fatherName || voter.mFatherName || voter.relation) && (
            <div className="detail-section">
              <h4 className="section-title">Family Information</h4>
              {voter.fatherName && (
                <div className="detail-row">
                  <span className="detail-label">Father's Name:</span>
                  <span className="detail-value">{voter.fatherName}</span>
                </div>
              )}
              {voter.mFatherName && (
                <div className="detail-row">
                  <span className="detail-label">Father (Marathi):</span>
                  <span className="detail-value">{voter.mFatherName}</span>
                </div>
              )}
              {voter.relation && (
                <div className="detail-row">
                  <span className="detail-label">Relation:</span>
                  <span className="detail-value">{voter.relation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="voter-card-footer">
        <button className="action-button download-btn" onClick={handleDownload}>
          <FiDownload />
          <span>Download PDF</span>
        </button>
        <button className="action-button share-btn" onClick={handleShare}>
          <FiMessageCircle />
          <span>Share Image</span>
        </button>
      </div>
    </div>
  );
};

export default VoterCard;
