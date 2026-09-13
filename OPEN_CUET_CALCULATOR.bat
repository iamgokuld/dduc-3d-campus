@echo off
title CUET DU Merit & Cutoff Telemetry // DDUC 2026
cd /d "%~dp0"
echo ======================================================================
echo   CUET DU Merit & Cutoff Telemetry Engine // DDUC 2026
echo   THAW Luxury Editorial Aesthetic Single Page Application
echo ======================================================================
echo   Opening in your browser at: http://localhost:3000/calculator.html
echo ======================================================================

start http://localhost:3000/calculator.html
powershell -ExecutionPolicy Bypass -File .\server.ps1
pause
