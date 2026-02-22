import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './InputPredictor.css';

const API_BASE_URL = 'http://localhost:8000';

const InputPredictor = () => {
  const [inputData, setInputData] = useState({
    temperature: 4.0,
    humidity: 60.0,
    vibration: 0.2,
    distance: 200.0
  });

  const [prediction, setPrediction] = useState(null);
  const [scenarioData, setScenarioData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setInputData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const predictShelfLife = async () => {
    setLoading(true);
    try {
      // Update telemetry first
      const updateResponse = await fetch(`${API_BASE_URL}/api/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update telemetry');
      }

      // Get prediction
      const response = await fetch(`${API_BASE_URL}/api/prediction`);
      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }
      
      const data = await response.json();
      setPrediction(data);

      // Generate scenario data for graph
      generateScenarioGraph(inputData, data.days_left);
    } catch (error) {
      console.error('Error predicting shelf life:', error);
      // Fallback to physics-based calculation
      const fallbackDays = calculatePrediction(inputData);
      setPrediction({
        days_left: fallbackDays,
        status: fallbackDays < 2 ? 'CRITICAL' : fallbackDays >= 5 ? 'NORMAL' : 'WARNING'
      });
      generateScenarioGraph(inputData, fallbackDays);
      alert('Backend not available. Using physics-based calculation. Make sure backend is running for ML predictions.');
    } finally {
      setLoading(false);
    }
  };

  const generateScenarioGraph = (baseInput, baseDaysLeft) => {
    const scenarios = [];
    
    // Scenario 1: Temperature variations
    for (let temp = -5; temp <= 45; temp += 5) {
      const tempInput = { ...baseInput, temperature: temp };
      scenarios.push({
        scenario: `Temp: ${temp}°C`,
        temperature: temp,
        predictedDays: calculatePrediction(tempInput)
      });
    }

    // Scenario 2: Humidity variations
    const humidityScenarios = [];
    for (let hum = 30; hum <= 95; hum += 10) {
      const humInput = { ...baseInput, humidity: hum };
      humidityScenarios.push({
        scenario: `Humidity: ${hum}%`,
        humidity: hum,
        predictedDays: calculatePrediction(humInput)
      });
    }

    // Scenario 3: Vibration variations
    const vibrationScenarios = [];
    for (let vib = 0; vib <= 2.0; vib += 0.2) {
      const vibInput = { ...baseInput, vibration: vib };
      vibrationScenarios.push({
        scenario: `Vibration: ${vib.toFixed(1)}G`,
        vibration: vib,
        predictedDays: calculatePrediction(vibInput)
      });
    }

    setScenarioData({
      temperature: scenarios,
      humidity: humidityScenarios,
      vibration: vibrationScenarios
    });
  };

  const calculatePrediction = (input) => {
    // Physics-based calculation (same as backend fallback)
    const idealTemp = 4;
    const baseShelfLife = 7;
    
    // Temperature factor (exponential decay)
    let tempFactor;
    if (input.temperature > idealTemp) {
      tempFactor = Math.pow(2, (input.temperature - idealTemp) / 10);
    } else {
      tempFactor = 1.0 / Math.pow(2, (idealTemp - input.temperature) / 10);
    }
    
    // Vibration factor
    const vibrationFactor = input.vibration > 0.5 ? 1.5 : 1.0;
    
    // Humidity factor
    const humidityFactor = 1 + (input.humidity - 60) / 100;
    
    const daysLeft = baseShelfLife / (tempFactor * vibrationFactor * humidityFactor);
    return Math.max(0, daysLeft);
  };

  return (
    <div className="input-predictor card">
      <h2 className="card-title">🔮 Custom Input Predictor</h2>
      <p className="predictor-description">
        Enter sensor values to predict shelf life and view scenario graphs
      </p>

      <div className="input-form">
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Temperature (°C)</label>
            <input
              type="number"
              className="input-field"
              value={inputData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              step="0.1"
              min="-5"
              max="45"
            />
            <input
              type="range"
              className="slider"
              min="-5"
              max="45"
              step="0.5"
              value={inputData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Humidity (%)</label>
            <input
              type="number"
              className="input-field"
              value={inputData.humidity}
              onChange={(e) => handleInputChange('humidity', e.target.value)}
              step="1"
              min="30"
              max="95"
            />
            <input
              type="range"
              className="slider"
              min="30"
              max="95"
              step="1"
              value={inputData.humidity}
              onChange={(e) => handleInputChange('humidity', e.target.value)}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Vibration (G)</label>
            <input
              type="number"
              className="input-field"
              value={inputData.vibration}
              onChange={(e) => handleInputChange('vibration', e.target.value)}
              step="0.1"
              min="0"
              max="2.0"
            />
            <input
              type="range"
              className="slider"
              min="0"
              max="2.0"
              step="0.1"
              value={inputData.vibration}
              onChange={(e) => handleInputChange('vibration', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Distance (km)</label>
            <input
              type="number"
              className="input-field"
              value={inputData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              step="10"
              min="0"
              max="500"
            />
            <input
              type="range"
              className="slider"
              min="0"
              max="500"
              step="10"
              value={inputData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
            />
          </div>
        </div>

        <button
          className="button button-primary predict-button"
          onClick={predictShelfLife}
          disabled={loading}
        >
          {loading ? 'Predicting...' : '🔮 Predict Shelf Life'}
        </button>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h3>Prediction Result</h3>
          <div className="result-card">
            <div className="result-item">
              <span className="result-label">Days Left:</span>
              <span className={`result-value ${prediction.status.toLowerCase()}`}>
                {prediction.days_left.toFixed(2)} days
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Status:</span>
              <span className={`result-status ${prediction.status.toLowerCase()}`}>
                {prediction.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {scenarioData.temperature && scenarioData.temperature.length > 0 && (
        <div className="scenario-graphs">
          <h3>Scenario Analysis Graphs</h3>
          
          <div className="graph-container">
            <h4>Temperature Impact on Shelf Life</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scenarioData.temperature}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="temperature" 
                  label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Days Left', angle: -90, position: 'insideLeft' }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predictedDays" 
                  stroke="#f44336" 
                  strokeWidth={3}
                  dot={{ fill: '#f44336', r: 4 }}
                  name="Predicted Days Left"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 2} 
                  stroke="#ff9800" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Critical Threshold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-container">
            <h4>Humidity Impact on Shelf Life</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scenarioData.humidity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="humidity" 
                  label={{ value: 'Humidity (%)', position: 'insideBottom', offset: -5 }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Days Left', angle: -90, position: 'insideLeft' }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predictedDays" 
                  stroke="#2196f3" 
                  strokeWidth={3}
                  dot={{ fill: '#2196f3', r: 4 }}
                  name="Predicted Days Left"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 2} 
                  stroke="#ff9800" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Critical Threshold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-container">
            <h4>Vibration Impact on Shelf Life</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scenarioData.vibration}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="vibration" 
                  label={{ value: 'Vibration (G)', position: 'insideBottom', offset: -5 }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Days Left', angle: -90, position: 'insideLeft' }}
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predictedDays" 
                  stroke="#9c27b0" 
                  strokeWidth={3}
                  dot={{ fill: '#9c27b0', r: 4 }}
                  name="Predicted Days Left"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 0.5} 
                  stroke="#ff9800" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="High Vibration Threshold"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 2} 
                  stroke="#f44336" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Critical Threshold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPredictor;
