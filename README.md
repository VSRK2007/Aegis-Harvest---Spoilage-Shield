# Aegis Harvest - Agri-Tech & Smart Logistics

## Spoilage Shield - Intelligent Logistics Application

A predictive supply chain dashboard that monitors food quality in real-time and takes automated actions to prevent waste.

## Features

- **Command Center Dashboard**: Live telemetry display (Temperature, Humidity, Vibration, Distance)
- **Predictive Shelf-Life ML Model**: Regression model predicting Days_Left (Remaining Shelf Life)
- **Smart Reroute Engine**: Automated logic that suggests Best_Center when shelf-life drops below threshold
- **Chaos Button**: Simulates cooling failure to test emergency response

## Project Structure

```
aegis-harvest/
├── backend/          # FastAPI backend server
├── frontend/         # React dashboard
├── ml_model/         # ML training and prediction
├── data/             # Dataset and mock data
└── requirements.txt  # Python dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.8+ installed
- Node.js and npm installed
- (Optional) Place `aegis_harvest_dataset.xlsx` in the `data/` folder. If not available, the system will generate synthetic data.

### Quick Setup (Windows)

1. **Setup Backend:**

   ```bash
   setup_backend.bat
   ```

   This will install Python dependencies and train the ML model.

2. **Setup Frontend:**
   ```bash
   setup_frontend.bat
   ```
   This will install Node.js dependencies.

### Manual Setup

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cd ..
cd ml_model
python train_model.py
cd ..
```

#### Frontend Setup

```bash
cd frontend
npm install
cd ..
```

### ML Model Training

The ML model will be automatically trained when you run `setup_backend.bat` or manually:

```bash
cd ml_model
python train_model.py
```

## Running the Application

### Option 1: Using Batch Files (Windows)

1. **Start Backend:**

   ```bash
   run_backend.bat
   ```

   Backend runs on http://localhost:8000

2. **Start Frontend (in a new terminal):**
   ```bash
   run_frontend.bat
   ```
   Frontend runs on http://localhost:3000

### Option 2: Manual Start

1. **Backend:**

   ```bash
   cd backend
   python app.py
   ```

2. **Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```

## Usage

1. Open your browser and navigate to http://localhost:3000
2. The dashboard will display live telemetry data (Temperature, Humidity, Vibration, Distance)
3. The ML model predicts Days_Left (Remaining Shelf Life) in real-time
4. Click the **"Chaos Button"** to simulate cooling failure
5. Watch the dashboard update:
   - Telemetry values spike (high temperature, humidity, vibration)
   - Days_Left countdown drops rapidly
   - Status changes to CRITICAL
   - Smart Reroute Engine activates automatically
6. Use the **Smart Reroute Engine** panel to calculate the best destination based on:
   - Road conditions (Smooth/Traffic/Blocked)
   - Facility capacity percentages
   - Travel times
   - Survival Margin calculations

## Features Explained

### Command Center Dashboard

- **Live Telemetry**: Real-time sensor data visualization
- **Predictive Shelf-Life**: ML-powered prediction of remaining shelf life
- **Status Indicators**: Color-coded alerts (Green=Normal, Orange=Warning, Red=Critical)

### Chaos Button (Cooling Failure Simulation)

- Toggles between NORMAL and CHAOS states
- In CHAOS mode:
  - Temperature spikes to 30-45°C
  - Humidity increases to 75-95%
  - Vibration increases to 0.6-1.2G
  - Days_Left rapidly decreases
  - Automatic reroute recommendations activate

### Smart Reroute Engine

- Calculates Survival Margin (SM) for each destination:
  - `SM = Days_Left - Travel_Time`
- Considers:
  - Road conditions (Blocked roads = infinite travel time)
  - Facility capacity (>90% = high risk, -2 days penalty)
  - All negative SM values trigger "Dump" recommendation
- Automatically suggests best center (Original/Center A/Center B/Dump)

## Technical Details

### ML Model

- **Algorithm**: Gradient Boosting Regressor
- **Features**: Temperature, Humidity, Vibration, Distance + engineered features
- **Physics-Based Rules**:
  - Temperature: Exponential decay (doubles every 10°C above 4°C)
  - Vibration: 1.5x multiplier if > 0.5G
  - Humidity: Linear impact on decay rate

### API Endpoints

- `GET /api/telemetry` - Get current telemetry
- `GET /api/prediction` - Get current prediction
- `POST /api/chaos` - Toggle chaos mode
- `POST /api/reroute` - Calculate best route
- `WS /ws/telemetry` - WebSocket for real-time updates

## Troubleshooting

- **Backend won't start**: Ensure Python dependencies are installed and port 8000 is available
- **Frontend won't start**: Ensure Node.js is installed and port 3000 is available
- **ML model not found**: Run `python ml_model/train_model.py` to train the model
- **WebSocket connection failed**: Ensure backend is running before starting frontend
