import React, { useState } from 'react';
import { FiDownload, FiShare2, FiUser, FiPhone, FiMapPin, FiCreditCard, FiLoader } from 'react-icons/fi';
import { getDownloadPdfUrl } from '../services/api';
import './VoterCard.css';

const VoterCard = ({ voter, index }) => {
  const [shareLoading, setShareLoading] = useState(false);
  
  const handleDownload = () => {
    window.open(getDownloadPdfUrl(voter.id), '_blank');
  };  

  const handleShare = async () => {
    setShareLoading(true);
    
    try {
      const shareUrl = `${process.env.REACT_APP_API_URL}/api/share/${voter.id}`;

      // Fetch the image
      const response = await fetch(shareUrl);
      
      // Handle systemPermission errors (503 status)
      if (response.status === 503) {
        const result = await response.json().catch(() => ({ message: 'System is temporarily unavailable' }));
        setShareLoading(false);
        alert(result.message || 'System is temporarily unavailable');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const file = new File([blob], `voter_${voter.id}_${voter.full_name.replace(/\s+/g, '_')}.png`, { 
        type: 'image/png' 
      });

      // Check if Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Voter Information - ${voter.full_name}`,
          text: `EPIC: ${voter.epic_no} | Booth: ${voter.booth_no} | Serial: ${voter.serial_no}`,
          files: [file]
        });
      } else if (navigator.share) {
        // Fallback: Share URL if files not supported
        await navigator.share({
          title: `Voter Information - ${voter.full_name}`,
          text: `EPIC: ${voter.epic_no} | Booth: ${voter.booth_no} | Serial: ${voter.serial_no}`,
          url: shareUrl
        });
      } else {
        // Desktop fallback: Download image and open WhatsApp Web
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `voter_${voter.id}_${voter.full_name.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Open WhatsApp Web for desktop users
        setTimeout(() => {
          window.open('https://web.whatsapp.com/', '_blank');
        }, 500);
      }
      
      setShareLoading(false);
    } catch (error) {
      console.error('Share failed:', error);
      setShareLoading(false);
      
      // Final fallback: Open share URL in new tab
      window.open(`${process.env.REACT_APP_API_URL}/api/share/${voter.id}`, '_blank');
    }
  };


  return (
    <div className="voter-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="voter-card-header">
        <div className="voter-icon">
          <FiUser />
        </div>
        <h3 className="voter-name">
          {voter.full_name}
        </h3>
      </div>

      <div className="voter-card-body">
        <div className="voter-info-grid">
          <div className="info-item">
            <FiCreditCard className="info-icon" />
            <div>
              <span className="info-label">EPIC</span>
              <span className="info-value">{voter.epic_no || 'N/A'}</span>
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
              <span className="info-value">{voter.booth_no || 'N/A'}</span>
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
              <span className="detail-value">{voter.serial_no || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Ward No:</span>
              <span className="detail-value">{voter.ward_no || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Municipality:</span>
              <span className="detail-value">{voter.municipality || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Assembly No:</span>
              <span className="detail-value">{voter.assembly_no || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4 className="section-title">Address Information</h4>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{voter.new_address || 'N/A'}</span>
            </div>
            {voter.society_name && (
              <div className="detail-row">
                <span className="detail-label">Society:</span>
                <span className="detail-value">{voter.society_name}</span>
              </div>
            )}
            {voter.flat_no && (
              <div className="detail-row">
                <span className="detail-label">Flat No:</span>
                <span className="detail-value">{voter.flat_no}</span>
              </div>
            )}
          </div>

          {(voter.worker_name || voter.demands || voter.dob) && (
            <div className="detail-section">
              <h4 className="section-title">Additional Information</h4>
              {voter.worker_name && (
                <div className="detail-row">
                  <span className="detail-label">Worker Name:</span>
                  <span className="detail-value">{voter.worker_name}</span>
                </div>
              )}
              {voter.dob && (
                <div className="detail-row">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{voter.dob}</span>
                </div>
              )}
              {voter.demands && (
                <div className="detail-row">
                  <span className="detail-label">Demands:</span>
                  <span className="detail-value">{voter.demands}</span>
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
        <button 
          className={`action-button share-btn ${shareLoading ? 'loading' : ''}`} 
          onClick={handleShare}
          disabled={shareLoading}
        >
          {shareLoading ? <FiLoader className="spinner" /> : <FiShare2 />}
          <span>{shareLoading ? 'Loading...' : 'Share Image'}</span>
        </button>
      </div>
    </div>
  );
};

export default VoterCard;
