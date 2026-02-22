# Aegis Harvest - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check

- ✅ Python 3.8+ installed
- ✅ Node.js installed
- ✅ Ports 8000 and 3000 available

### Step 1: Setup (One-time)

```bash
# Setup backend (installs dependencies + trains ML model)
setup_backend.bat

# Setup frontend (installs npm packages)
setup_frontend.bat
```

### Step 2: Run Application

**Terminal 1 - Backend:**

```bash
run_backend.bat
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**

```bash
run_frontend.bat
```

Browser will open automatically at http://localhost:3000

### Step 3: Test Features

1. **View Dashboard** - See live telemetry updating
2. **Click Chaos Button** - Simulate cooling failure
3. **Watch Predictions** - See Days_Left drop in real-time
4. **Test Reroute** - Use Smart Reroute Engine panel

## 🎯 Key Features Demo

### Normal Mode

- Temperature: ~4°C (green)
- Days Left: ~7 days
- Status: NORMAL

### Chaos Mode (Click Button)

- Temperature: 30-45°C (red)
- Days Left: < 2 days
- Status: CRITICAL
- Auto-reroute activated

## 📊 Dashboard Components

1. **Live Telemetry Panel** - Real-time sensor data
2. **Prediction Card** - ML-powered shelf-life prediction
3. **Chaos Button** - Emergency simulation toggle
4. **Smart Reroute Engine** - Calculate best destination
5. **Analytics Dashboard** - Historical trends

## 🔧 Troubleshooting

**Backend won't start?**

- Check Python is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Train model: `cd ml_model && python train_model.py`

**Frontend won't start?**

- Check Node.js: `node --version`
- Install packages: `cd frontend && npm install`

**No data showing?**

- Ensure backend is running first
- Check browser console for errors
- Verify WebSocket connection

## 📝 Next Steps

- Read full documentation in `README.md`
- Check `SETUP.md` for detailed setup
- Customize ML model in `ml_model/train_model.py`
- Modify UI in `frontend/src/components/`

---

**Need Help?** Check the main README.md for detailed information.
