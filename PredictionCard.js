import React from "react";
import "./PredictionCard.css";

const PredictionCard = ({ prediction, destination }) => {
  // Default values to prevent undefined errors
  const pred = prediction || { days_left: 7.0, status: "NORMAL" };
  const dest = destination || "Mumbai Premium Supermarket";

  const getStatusClass = (status) => {
    if (!status) return "status-normal";
    switch (status) {
      case "CRITICAL":
        return "status-critical";
      case "WARNING":
        return "status-warning";
      default:
        return "status-normal";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return "✅";
    switch (status) {
      case "CRITICAL":
        return "🚨";
      case "WARNING":
        return "⚠️";
      default:
        return "✅";
    }
  };

  const formatDaysLeft = (days) => {
    if (days === undefined || days === null) return "7.0 days";
    if (days < 1) {
      const hours = Math.floor(days * 24);
      return `${hours} hours`;
    }
    return `${days.toFixed(1)} days`;
  };

  return (
    <div
      className={`prediction-card card ${getStatusClass(pred.status)}`}
    >
      <h2 className="card-title">
        {getStatusIcon(pred.status)} Predictive Shelf-Life
      </h2>

      <div className="prediction-content">
        <div className="days-left-display">
          <div className="days-left-value">
            {formatDaysLeft(pred.days_left)}
          </div>
          <div className="days-left-label">Remaining Shelf Life</div>
        </div>

        <div className="status-badge">
          <span
            className={`status-indicator ${getStatusClass(pred.status)}`}
          ></span>
          {pred.status || "NORMAL"}
        </div>

        <div className="destination-info">
          <div className="destination-label">Current Destination:</div>
          <div className="destination-value">{dest}</div>
        </div>

        {pred.status === "CRITICAL" && (
          <div className="alert-message">
            ⚠️ Immediate action required! Shelf-life critical. Consider
            rerouting.
          </div>
        )}

        {pred.status === "WARNING" && (
          <div className="warning-message">
            ⚠️ Shelf-life below optimal. Monitor closely.
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
