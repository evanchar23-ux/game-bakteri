@echo off
title Viral Slayer - Game Launcher
echo ========================================================
echo     VIRAL SLAYER: THE MICROSCOPIC IMMUNITY WAR
echo ========================================================
echo.
echo Sedang menjalankan local web server...
echo Membuka game di browser: http://localhost:8080/
echo.
echo JANGAN TUTUP JENDELA INI SELAMA BERMAIN GAME.
echo (Tekan Ctrl+C atau silang jendela ini jika ingin berhenti)
echo ========================================================
echo.

start "" "http://localhost:8080/"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0serve.ps1"
pause
