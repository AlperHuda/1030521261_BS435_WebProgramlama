@echo off
echo Starting Backend API...
python -m uvicorn app.main:app --reload
pause
