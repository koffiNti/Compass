@echo off
TITLE Compass AI Personal Operating System
echo Starting Compass AI Personal Operating System...

:: Start Backend FastAPI
start "Compass Backend" /min cmd /c "cd ..\backend && python -m uvicorn app.main:app --port 8000"

:: Start Frontend Vite/Preview
start "Compass Frontend" /min cmd /c "cd ..\frontend && npm run dev"

timeout /t 3 >nul

:: Open Native Browser / Window
start http://localhost:3000

echo Compass Operating System is active at http://localhost:3000
