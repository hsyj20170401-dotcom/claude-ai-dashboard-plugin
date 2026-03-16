@echo off
setlocal
set "DIR=%~dp0"
cd /d "%DIR%"
set "PORT=8765"

netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
  echo AI Dashboard server already running on port %PORT%.
) else (
  where py >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    start "AI Dashboard Server" /B py -3 "%DIR%scripts\local_dashboard_server.py" %PORT% > "%TEMP%\ai-dashboard-server.log" 2>&1
  ) else (
    start "AI Dashboard Server" /B python "%DIR%scripts\local_dashboard_server.py" %PORT% > "%TEMP%\ai-dashboard-server.log" 2>&1
  )
  timeout /t 1 >nul
)

start "" "http://127.0.0.1:%PORT%/ai-dashboard.refactor.html?config=dashboard-config.local.json&lang=ko"
echo AI Dashboard launch requested on port %PORT%.
endlocal
