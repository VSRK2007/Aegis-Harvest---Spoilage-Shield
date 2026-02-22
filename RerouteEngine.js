import React, { useState } from "react";
import "./RerouteEngine.css";

const RerouteEngine = ({ prediction, onReroute, destination }) => {
  // Default values to prevent undefined errors
  const pred = prediction || { days_left: 7.0, status: "NORMAL" };

  const [rerouteData, setRerouteData] = useState({
    road_condition: "Smooth",
    cap_pct_center_a: 70,
    cap_pct_center_b: 65,
    travel_time_original: 3,  // Reduced to trigger emergency more easily
    travel_time_center_a: 2,
    travel_time_center_b: 2.5,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setRerouteData((prev) => ({
      ...prev,
      [field]:
        field.includes("cap_pct") || field.includes("travel_time")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleCalculateReroute = async () => {
    setLoading(true);
    const rerouteResult = await onReroute(rerouteData);
    setResult(rerouteResult);
    setLoading(false);
  };

  const shouldShowReroute =
    (pred.days_left || 7.0) < 2 || pred.status === "CRITICAL";

  return (
    <div
      className={`reroute-engine card ${
        shouldShowReroute ? "reroute-active" : ""
      }`}
    >
      <h2 className="card-title">🧭 Smart Reroute Engine</h2>

      {shouldShowReroute && (
        <div className="reroute-alert">
          ⚠️ Shelf-life critical! Reroute recommended.
        </div>
      )}

      <div className="reroute-form">
        <div className="input-group">
          <label className="input-label">Road Condition</label>
          <select
            className="select-field"
            value={rerouteData.road_condition}
            onChange={(e) =>
              handleInputChange("road_condition", e.target.value)
            }
          >
            <option value="Smooth">Smooth</option>
            <option value="Traffic">Traffic</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Center A Capacity (%)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            max="100"
            value={rerouteData.cap_pct_center_a}
            onChange={(e) =>
              handleInputChange("cap_pct_center_a", e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Center B Capacity (%)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            max="100"
            value={rerouteData.cap_pct_center_b}
            onChange={(e) =>
              handleInputChange("cap_pct_center_b", e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Travel Time - Original (hours)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            step="0.5"
            value={rerouteData.travel_time_original}
            onChange={(e) =>
              handleInputChange("travel_time_original", e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Travel Time - Center A (hours)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            step="0.5"
            value={rerouteData.travel_time_center_a}
            onChange={(e) =>
              handleInputChange("travel_time_center_a", e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Travel Time - Center B (hours)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            step="0.5"
            value={rerouteData.travel_time_center_b}
            onChange={(e) =>
              handleInputChange("travel_time_center_b", e.target.value)
            }
          />
        </div>

        <button
          className="button button-primary"
          onClick={handleCalculateReroute}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Best Route"}
        </button>
      </div>

      {result && (
        <div className="reroute-result">
          <h3>Reroute Recommendation</h3>
          {result.emergency_rescue && (
            <div className="emergency-badge">
              🚨 Emergency Triage Active
            </div>
          )}
          <div className={`recommendation ${(result.status || "normal").toLowerCase()}`}>
            <div className="recommendation-title">{result.recommendation || "—"}</div>
            <div className="best-center">
              Best Center: <strong>{result.best_center || "—"}</strong>
            </div>
          </div>

          <div className="survival-margins">
            <h4>Survival Margins:</h4>
            <div className="margin-item">
              <span>Original:</span>
              <span
                className={
                  (result.survival_margins && result.survival_margins["Original"]) < 0
                    ? "negative"
                    : "positive"
                }
              >
                {result.survival_margins && result.survival_margins["Original"] != null
                  ? result.survival_margins["Original"].toFixed(2)
                  : "—"} days
              </span>
            </div>
            <div className="margin-item">
              <span>Center A:</span>
              <span
                className={
                  (result.survival_margins && result.survival_margins["Center A"]) < 0
                    ? "negative"
                    : "positive"
                }
              >
                {result.survival_margins && result.survival_margins["Center A"] != null
                  ? result.survival_margins["Center A"].toFixed(2)
                  : "—"} days
              </span>
            </div>
            <div className="margin-item">
              <span>Center B:</span>
              <span
                className={
                  (result.survival_margins && result.survival_margins["Center B"]) < 0
                    ? "negative"
                    : "positive"
                }
              >
                {result.survival_margins && result.survival_margins["Center B"] != null
                  ? result.survival_margins["Center B"].toFixed(2)
                  : "—"} days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RerouteEngine;
