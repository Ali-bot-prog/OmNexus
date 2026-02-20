@echo off
echo Emlak Asistani Baslatiliyor...

echo 1. Backend Baslatiliyor (Port 5555)...
start "Emlak Backend API" cmd /k "python main.py"

echo Kisa sure bekleniyor...
timeout /t 3 >nul

echo 2. Frontend Baslatiliyor (Port 3000)...
cd dashboard
start "Emlak Dashboard" cmd /k "npm run dev"

echo.
echo ===============================================
echo Sistemler arka planda aciliyor.
echo Tarayicinizdan http://localhost:3000 adresine gidebilirsiniz.
echo ===============================================
pause
