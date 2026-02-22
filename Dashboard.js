import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DownloadButton from "./DownloadButton";
import "./Dashboard.css";

const Dashboard = ({ telemetry, prediction, chaosMode }) => {
  // Default values to prevent undefined errors
  const tel = telemetry || { temperature: 4.0, humidity: 60.0, vibration: 0.2 };
  const pred = prediction || { days_left: 7.0, status: "NORMAL" };
  const mode = chaosMode || false;

  // Generate historical data for visualization (last 10 readings)
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    if (tel && pred) {
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            temperature: tel.temperature || 4.0,
            humidity: tel.humidity || 60.0,
            vibration: (tel.vibration || 0.2) * 10, // Scale for visibility
            daysLeft: pred.days_left || 7.0,
          },
        ];
        // Keep only last 20 readings
        return newHistory.slice(-20);
      });
    }
  }, [tel, pred]);

  const chartData = history.map((item, index) => ({
    ...item,
    index,
  }));

  return (
    <div className="dashboard card">
      <h2 className="card-title">📈 Real-Time Analytics</h2>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Temperature & Humidity Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#fff"
                tick={{ fill: "#fff", fontSize: 12 }}
              />
              <YAxis stroke="#fff" tick={{ fill: "#fff", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f44336"
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#2196f3"
                strokeWidth={2}
                dot={false}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Shelf-Life Prediction Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#fff"
                tick={{ fill: "#fff", fontSize: 12 }}
              />
              <YAxis stroke="#fff" tick={{ fill: "#fff", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="daysLeft"
                stroke={mode ? "#f44336" : "#4caf50"}
                strokeWidth={3}
                dot={false}
                name="Days Left"
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
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Current Status</div>
          <div className={`stat-value ${(pred.status || "NORMAL").toLowerCase()}`}>
            {pred.status || "NORMAL"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Mode</div>
          <div className={`stat-value ${mode ? "chaos" : "normal"}`}>
            {mode ? "CRISIS" : "NORMAL"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Remaining Shelf Life</div>
          <div className="stat-value">
            {(pred.days_left || 7.0).toFixed(2)} days
          </div>
        </div>
      </div>

      <DownloadButton />
    </div>
  );
};

export default Dashboard;
