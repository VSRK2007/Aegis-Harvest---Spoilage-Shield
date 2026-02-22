# Aegis Harvest - Complete Setup Guide

## Step-by-Step Setup Instructions

### Step 1: Install Prerequisites

#### Python Setup

1. Download and install Python 3.8 or higher from https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Verify installation:
   ```bash
   python --version
   ```

#### Node.js Setup

1. Download and install Node.js (LTS version) from https://nodejs.org/
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Prepare Dataset (Optional)

1. Place your `aegis_harvest_dataset.xlsx` file in the `data/` folder
2. If you don't have the dataset, the system will automatically generate synthetic data based on the physics rules

### Step 3: Setup Backend

#### Option A: Using Batch File (Windows)

```bash
setup_backend.bat
```

#### Option B: Manual Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Train ML model
cd ml_model
python train_model.py
cd ..
```

### Step 4: Setup Frontend

#### Option A: Using Batch File (Windows)

```bash
setup_frontend.bat
```

#### Option B: Manual Setup

```bash
cd frontend
npm install
cd ..
```

### Step 5: Run the Application

#### Terminal 1: Start Backend

```bash
# Option A: Using batch file
run_backend.bat

# Option B: Manual
cd backend
python app.py
```

The backend will start on **http://localhost:8000**

#### Terminal 2: Start Frontend

```bash
# Option A: Using batch file
run_frontend.bat

# Option B: Manual
cd frontend
npm start
```

The frontend will start on **http://localhost:3000** (browser should open automatically)

### Step 6: Verify Installation

1. Open http://localhost:3000 in your browser
2. You should see the Aegis Harvest dashboard
3. Check that telemetry data is updating
4. Test the Chaos Button to simulate cooling failure

## Common Issues and Solutions

### Issue: "Module not found" errors

**Solution**: Ensure all Python dependencies are installed:

```bash
pip install -r requirements.txt
```

### Issue: "Model files not found"

**Solution**: Train the model:

```bash
cd ml_model
python train_model.py
```

### Issue: Port already in use

**Solution**:

- Backend (port 8000): Close other applications using port 8000 or change port in `backend/app.py`
- Frontend (port 3000): Close other applications using port 3000

### Issue: WebSocket connection failed

**Solution**: Ensure backend is running before starting frontend

### Issue: npm install fails

**Solution**:

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

## Project Structure

```
aegis-harvest/
├── backend/
│   ├── app.py                 # FastAPI server
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   └── components/       # React components
│   └── package.json          # Node dependencies
├── ml_model/
│   ├── train_model.py        # ML model training script
│   ├── predict.py            # Prediction module
│   └── models/               # Trained models (generated)
├── data/
│   └── aegis_harvest_dataset.xlsx  # Dataset (optional)
├── setup_backend.bat         # Backend setup script
├── setup_frontend.bat        # Frontend setup script
├── run_backend.bat           # Backend run script
├── run_frontend.bat          # Frontend run script
└── README.md                 # Project documentation
```

## Testing the Application

### Test Normal Operation

1. Dashboard should show green status
2. Temperature around 4°C
3. Days_Left around 5-7 days
4. Destination: "Original"

### Test Chaos Mode

1. Click "Chaos Button"
2. Temperature should spike to 30-45°C
3. Days_Left should drop rapidly
4. Status should change to CRITICAL (red)
5. Dashboard should show warning animations

### Test Reroute Engine

1. Enter reroute parameters in Smart Reroute Engine panel
2. Click "Calculate Best Route"
3. Check Survival Margins for each destination
4. Verify Best_Center recommendation

## Next Steps

- Place your actual dataset in `data/` folder for better predictions
- Customize the ML model parameters in `ml_model/train_model.py`
- Adjust the UI styling in `frontend/src/` CSS files
- Add more features as needed

## Support

For issues or questions, refer to the main README.md file or check the code comments in the source files.
