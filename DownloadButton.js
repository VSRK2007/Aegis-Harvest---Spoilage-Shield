import React from "react";
import "./DownloadButton.css";

const API_BASE_URL = "http://localhost:8000";

const DownloadButton = () => {
  const handleDownload = async (type, format) => {
    try {
      const endpoint = type === "telemetry" 
        ? `/api/export/telemetry?format=${format}`
        : `/api/export/report?format=${format}`;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error("Download failed");
      }
      
      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = type === "telemetry" 
        ? `aegis_telemetry_${new Date().toISOString().slice(0, 10)}.${format}`
        : `aegis_report_${new Date().toISOString().slice(0, 10)}.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Get blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please make sure the backend is running.");
    }
  };

  return (
    <div className="download-section">
      <h3 className="download-title">📥 Export Data</h3>
      <div className="download-buttons">
        <div className="download-group">
          <span className="download-label">Telemetry Data:</span>
          <button
            className="download-btn"
            onClick={() => handleDownload("telemetry", "json")}
            title="Download telemetry data as JSON"
          >
            📄 JSON
          </button>
          <button
            className="download-btn"
            onClick={() => handleDownload("telemetry", "csv")}
            title="Download telemetry data as CSV"
          >
            📊 CSV
          </button>
        </div>
        <div className="download-group">
          <span className="download-label">Full Report:</span>
          <button
            className="download-btn"
            onClick={() => handleDownload("report", "json")}
            title="Download comprehensive report as JSON"
          >
            📄 JSON
          </button>
          <button
            className="download-btn"
            onClick={() => handleDownload("report", "csv")}
            title="Download comprehensive report as CSV"
          >
            📊 CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadButton;
