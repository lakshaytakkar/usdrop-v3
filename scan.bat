@echo off
echo === DISK SPACE ===
wmic logicaldisk get caption,freespace,size

echo.
echo === LARGE FILES IN DOWNLOADS ===
forfiles /P "%USERPROFILE%\Downloads" /S /M *.* /C "cmd /c if @fsize GEQ 52428800 echo @fsize bytes - @path" 2>nul

echo.
echo === LARGE FILES ON DESKTOP ===
forfiles /P "%USERPROFILE%\Desktop" /S /M *.* /C "cmd /c if @fsize GEQ 52428800 echo @fsize bytes - @path" 2>nul

echo.
echo === LARGE FILES IN DOCUMENTS ===
forfiles /P "%USERPROFILE%\Documents" /M *.* /C "cmd /c if @fsize GEQ 52428800 echo @fsize bytes - @path" 2>nul

echo.
echo === OLD FILES NOT ACCESSED IN 180+ DAYS (Downloads) ===
forfiles /P "%USERPROFILE%\Downloads" /S /D -180 /C "cmd /c if @fsize GEQ 10485760 echo @fdate - @fsize bytes - @path" 2>nul
