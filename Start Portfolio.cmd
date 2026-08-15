@echo off
title Akther V N - 3D Portfolio
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is required to open this portfolio.
  echo Install Node.js from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

node serve-portfolio.mjs

if errorlevel 1 (
  echo.
  echo The portfolio could not start. See the message above.
  pause
)
