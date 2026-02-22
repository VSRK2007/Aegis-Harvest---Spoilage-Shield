import React from "react";
import "./ChaosButton.css";

const ChaosButton = ({ chaosMode, onToggle }) => {
  return (
    <div
      className={`chaos-button-container card ${
        chaosMode ? "chaos-active" : ""
      }`}
    >
      <h2 className="card-title">⚡ System Control</h2>

      <div className="chaos-description">
        <p>Simulate cooling failure to test emergency response</p>
      </div>

      <button
        className={`chaos-button ${chaosMode ? "chaos-on" : "chaos-off"}`}
        onClick={onToggle}
      >
        {chaosMode ? (
          <>
            <span className="chaos-icon">🔥</span>
            <span>COOLING FAILURE ACTIVE</span>
            <span className="chaos-icon">🔥</span>
          </>
        ) : (
          <>
            <span className="chaos-icon">❄️</span>
            <span>SYSTEM NORMAL</span>
            <span className="chaos-icon">❄️</span>
          </>
        )}
      </button>

      {chaosMode && (
        <div className="chaos-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">
            <strong>CRISIS MODE ACTIVE</strong>
            <p>
              Temperature and vibration sensors reporting critical values. AI
              reroute engine activated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaosButton;
