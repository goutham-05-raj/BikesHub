@echo off
echo Installing jack-portfolio dependencies...
cd /d "%~dp0jack-portfolio"
npm install
echo.
echo Done! Starting dev server...
npm run dev
