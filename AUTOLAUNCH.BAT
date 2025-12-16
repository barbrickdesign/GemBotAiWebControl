@echo off
REM ════════════════════════════════════════════════════════════════════════════
REM GEMBOT UNIVERSE KEY - AUTOLAUNCH SCRIPT
REM ════════════════════════════════════════════════════════════════════════════
REM OWNERSHIP: Ryan Barbrick / Barbrick Design
REM CONTACT: BarbrickDesign@gmail.com
REM SIGNATURE: GBOT-RB-2025-7X9K2M4P-BARBRICK
REM ════════════════════════════════════════════════════════════════════════════

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║                                                                        ║
echo ║               🔑 GEMBOT UNIVERSE KEY - LAUNCHER 🔑                     ║
echo ║                                                                        ║
echo ║                    © 2024-2025 Ryan Barbrick                          ║
echo ║                   BarbrickDesign@gmail.com                            ║
echo ║                                                                        ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.
echo Starting GemBot Universe Key...
echo.

REM Get the USB drive letter (current directory)
set USBDRIVE=%~d0
set USBPATH=%~dp0

echo USB Drive: %USBDRIVE%
echo USB Path: %USBPATH%
echo.

REM Check if launcher HTML exists
if not exist "%USBPATH%gembot-universe-key-launcher.html" (
    echo ERROR: Launcher not found!
    echo Expected: %USBPATH%gembot-universe-key-launcher.html
    pause
    exit /b 1
)

echo ✅ Launcher found
echo.
echo Opening in your default browser...
echo.

REM Open launcher in default browser
start "" "%USBPATH%gembot-universe-key-launcher.html?autostart=true"

echo.
echo ✅ GemBot Universe Key launched!
echo.
echo You can close this window now.
echo The launcher will open in your browser.
echo.

timeout /t 3 /nobreak >nul
exit
