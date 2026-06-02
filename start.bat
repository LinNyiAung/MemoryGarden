@echo off
echo.
echo  🌸 Starting Memory Garden...
echo.

:: Start backend in a new window
echo  Starting backend on http://localhost:3001
start "Memory Garden - Backend" cmd /k "cd /d %~dp0backend && node server.js"

:: Wait a moment for backend to initialize
timeout /t 2 /nobreak >nul

:: Start frontend in a new window
echo  Starting frontend on http://localhost:5173
start "Memory Garden - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  ✅ Both servers are starting in separate windows!
echo.
echo     Frontend: http://localhost:5173
echo     Backend:  http://localhost:3001
echo.
echo  Open http://localhost:5173 in your browser.
echo  Close the two server windows to stop.
echo.
pause
