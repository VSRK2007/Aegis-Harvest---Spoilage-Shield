import React from 'react';
import './EmergencyRescue.css';

const EmergencyRescue = ({ emergencyRescue }) => {
  if (!emergencyRescue) return null;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="emergency-rescue card emergency-active">
      <div className="emergency-header">
        <span className="emergency-icon">🚨</span>
        <h2 className="emergency-title">Emergency Triage Activated</h2>
      </div>

      <div className="rescue-alert">
        <div className="alert-message">
          <strong>Cargo cannot reach {emergencyRescue.original_destination} (100% Value)</strong>
          <br />
          Rerouting to <strong>{emergencyRescue.rescue_point}</strong> (Rescue Value: {emergencyRescue.rescue_value_pct}%)
          <br />
          <span className="loss-prevented-text">Total Loss Prevented: ₹{emergencyRescue.loss_prevented.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="rescue-details">
        <div className="rescue-value-card">
          <div className="value-label">Rescue Value Recovery</div>
          <div className="value-percentage">
            {emergencyRescue.rescue_value_pct}%
          </div>
          <div className="value-amount">
            {formatCurrency(emergencyRescue.rescue_value)}
          </div>
        </div>

        <div className="loss-prevented-card">
          <div className="value-label">Total Loss Prevented</div>
          <div className="loss-amount">
            {formatCurrency(emergencyRescue.loss_prevented)}
          </div>
          <div className="loss-percentage">
            Saved {100 - emergencyRescue.rescue_value_pct}% of cargo value
          </div>
        </div>
      </div>

      <div className="rescue-info">
        <div className="info-row">
          <span className="info-label">Rescue Point:</span>
          <span className="info-value">{emergencyRescue.rescue_point}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Type:</span>
          <span className="info-value">{emergencyRescue.rescue_type}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Distance:</span>
          <span className="info-value">{emergencyRescue.distance} km</span>
        </div>
        <div className="info-row">
          <span className="info-label">Travel Time:</span>
          <span className="info-value">{emergencyRescue.travel_time} hours</span>
        </div>
      </div>

      {emergencyRescue.all_rescue_options && emergencyRescue.all_rescue_options.length > 1 && (
        <div className="alternative-options">
          <div className="alternatives-label">Alternative Rescue Options:</div>
          <div className="alternatives-list">
            {emergencyRescue.all_rescue_options.slice(1).map((option, index) => (
              <div key={index} className="alternative-item">
                <span className="alt-name">{option.name}</span>
                <span className="alt-value">{option.rescue_value_pct}% Value</span>
                <span className="alt-time">{option.travel_time}h away</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyRescue;
