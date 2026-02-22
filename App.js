import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import TelemetryPanel from "./components/TelemetryPanel";
import PredictionCard from "./components/PredictionCard";
import RerouteEngine from "./components/RerouteEngine";
import ChaosButton from "./components/ChaosButton";
import InputPredictor from "./components/InputPredictor";
import ProductSelector from "./components/ProductSelector";
import EmergencyRescue from "./components/EmergencyRescue";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [telemetry, setTelemetry] = useState({
    temperature: 4.0,
    humidity: 60.0,
    vibration: 0.2,
    distance: 200.0,
    timestamp: new Date().toISOString(),
  });

  const [prediction, setPrediction] = useState({
    days_left: 7.0,
    status: "NORMAL",
  });

  const [chaosMode, setChaosMode] = useState(false);
  const [destination, setDestination] = useState("Mumbai Premium Supermarket");
  const [ws, setWs] = useState(null);
  const [emergencyRescue, setEmergencyRescue] = useState(null);
  const [productType, setProductType] = useState("Tomato");

  // WebSocket connection for real-time updates
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/telemetry");

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTelemetry(data.telemetry);
      setPrediction({
        days_left: data.days_left,
        status:
          data.days_left < 2
            ? "CRITICAL"
            : data.days_left >= 5
            ? "NORMAL"
            : "WARNING",
      });
      setChaosMode(data.chaos_mode);
      setDestination(data.destination);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/telemetry`)
      .then((res) => res.json())
      .then((data) => setTelemetry(data))
      .catch((err) => console.error("Error fetching telemetry:", err));

    fetch(`${API_BASE_URL}/api/prediction`)
      .then((res) => res.json())
      .then((data) => setPrediction(data))
      .catch((err) => console.error("Error fetching prediction:", err));

    fetch(`${API_BASE_URL}/api/chaos/status`)
      .then((res) => res.json())
      .then((data) => setChaosMode(data.chaos_mode))
      .catch((err) => console.error("Error fetching chaos status:", err));
  }, []);

  const handleChaosToggle = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chaos`, {
        method: "POST",
      });
      const data = await response.json();
      setChaosMode(data.chaos_mode);
      setTelemetry(data.telemetry);
      setPrediction({
        days_left: data.days_left,
        status:
          data.days_left < 2
            ? "CRITICAL"
            : data.days_left >= 5
            ? "NORMAL"
            : "WARNING",
      });
      
      // Check if Emergency Triage was automatically triggered
      if (data.emergency_rescue) {
        setEmergencyRescue(data.emergency_rescue);
        setDestination(data.emergency_rescue.rescue_point);
      } else {
        setEmergencyRescue(null);
      }
    } catch (error) {
      console.error("Error toggling chaos mode:", error);
    }
  }, []);

  const handleReroute = useCallback(async (rerouteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reroute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rerouteData),
      });
      const data = await response.json();
      setDestination(data.best_center);
      setPrediction({
        days_left: data.days_left,
        status: data.status,
      });
      
      // Set emergency rescue data if available
      if (data.emergency_rescue) {
        setEmergencyRescue(data.emergency_rescue);
      } else {
        setEmergencyRescue(null);
      }
      
      return data;
    } catch (error) {
      console.error("Error calculating reroute:", error);
      return null;
    }
  }, []);

  const handleProductChange = useCallback((product) => {
    setProductType(product);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛡️ Aegis Harvest - Spoilage Shield</h1>
        <p className="subtitle">Intelligent Logistics Command Center</p>
      </header>

      <ProductSelector onProductChange={handleProductChange} />

      {emergencyRescue && (
        <EmergencyRescue emergencyRescue={emergencyRescue} />
      )}

      <div className="dashboard-container">
        <div className="main-panel">
          <TelemetryPanel telemetry={telemetry} chaosMode={chaosMode} />
          <PredictionCard prediction={prediction} destination={destination} />
        </div>

        <div className="side-panel">
          <ChaosButton chaosMode={chaosMode} onToggle={handleChaosToggle} />
          <RerouteEngine
            prediction={prediction}
            onReroute={handleReroute}
            destination={destination}
          />
        </div>
      </div>

      <Dashboard
        telemetry={telemetry}
        prediction={prediction}
        chaosMode={chaosMode}
      />

      <InputPredictor />
    </div>
  );
}

export default App;
