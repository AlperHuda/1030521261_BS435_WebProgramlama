@echo off
setlocal

echo ===================================================
echo AI Gorsel Tahmin Oyunu - Baslatma Scripti
echo ===================================================

cd /d "%~dp0"

echo.
echo [1/4] Backend Kontrolu...
if not exist "backend\venv" (
    echo Venv bulunamadi, olusturuluyor...
    python -m venv backend\venv
)

echo Backend paketleri yukleniyor/guncelleniyor...
call backend\venv\Scripts\activate
pip install -r backend\requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo HATA: Backend paketleri yuklenemedi!
    pause
    exit /b 1
)

echo.
echo [2/4] Frontend Kontrolu...
cd frontend
if not exist "node_modules" (
    echo Node modulleri bulunamadi, yukleniyor...
    call npm install
) else (
    echo Node modulleri guncelleniyor...
    call npm install
)
cd ..

echo.
echo [3/4] Sunucular Baslatiliyor...
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Pencereyi kapatirsaniz sunucular durur.
echo.

start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload"
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Baslatma islemi tamamlandi! Iyi oyunlar!
