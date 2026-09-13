@echo off
title Deen Dayal Upadhyaya College (DDUC) - 3D Campus
cd /d "%~dp0"
echo ==========================================================
echo   Deen Dayal Upadhyaya College (DDUC) - 3D Campus Server
echo ==========================================================
echo   Opening in your browser at: http://localhost:3000/
echo ==========================================================
powershell -ExecutionPolicy Bypass -File .\server.ps1
pause
