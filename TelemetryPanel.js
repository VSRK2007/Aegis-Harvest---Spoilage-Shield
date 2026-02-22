import React from "react";
import "./TelemetryPanel.css";

const TelemetryPanel = ({ telemetry, chaosMode }) => {
  // Default values to prevent undefined errors
  const tel = telemetry || {
    temperature: 4.0,
    humidity: 60.0,
    vibration: 0.2,
    distance: 200.0,
    timestamp: new Date().toISOString()
  };

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return `0.00 ${unit}`;
    return `${value.toFixed(2)} ${unit}`;
  };

  const getStatusColor = (metric, value) => {
    if (chaosMode) return "#f44336";

    switch (metric) {
      case "temperature":
        return value > 10 ? "#ff9800" : value < 0 ? "#2196f3" : "#4caf50";
      case "humidity":
        return value > 80 ? "#ff9800" : value < 40 ? "#2196f3" : "#4caf50";
      case "vibration":
        return value > 0.5 ? "#f44336" : "#4caf50";
      default:
        return "#4caf50";
    }
  };

  return (
    <div className={`telemetry-panel card ${chaosMode ? "chaos-mode" : ""}`}>
      <h2 className="card-title">
        📊 Live Telemetry
        {chaosMode && <span className="chaos-badge">⚠️ CRISIS MODE</span>}
      </h2>

      <div className="telemetry-grid">
        <div className="telemetry-item">
          <div className="telemetry-icon">🌡️</div>
          <div className="telemetry-info">
            <div className="telemetry-label">Temperature</div>
            <div
              className="telemetry-value"
              style={{
                color: getStatusColor("temperature", tel.temperature),
              }}
            >
              {formatValue(tel.temperature, "°C")}
            </div>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">💧</div>
          <div className="telemetry-info">
            <div className="telemetry-label">Humidity</div>
            <div
              className="telemetry-value"
              style={{ color: getStatusColor("humidity", tel.humidity) }}
            >
              {formatValue(tel.humidity, "%")}
            </div>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">📳</div>
          <div className="telemetry-info">
            <div className="telemetry-label">Vibration</div>
            <div
              className="telemetry-value"
              style={{
                color: getStatusColor("vibration", tel.vibration),
              }}
            >
              {formatValue(tel.vibration, "G")}
            </div>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">📍</div>
          <div className="telemetry-info">
            <div className="telemetry-label">Distance</div>
            <div className="telemetry-value">
              {formatValue(tel.distance, "km")}
            </div>
          </div>
        </div>
      </div>

      <div className="timestamp">
        Last updated: {new Date(tel.timestamp || new Date()).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default TelemetryPanel;
