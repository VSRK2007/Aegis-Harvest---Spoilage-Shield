@echo off
echo Setting up Aegis Harvest Backend...
cd backend
pip install -r requirements.txt
cd ..
cd ml_model
python train_model.py
cd ..
echo Backend setup complete!
pause
