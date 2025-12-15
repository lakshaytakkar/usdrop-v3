# Disk Space Analysis Script
Write-Host "=== DISK SPACE OVERVIEW ===" -ForegroundColor Cyan
Get-PSDrive -PSProvider FileSystem | Format-Table Name,@{N='Used(GB)';E={[math]::Round($_.Used/1GB,1)}},@{N='Free(GB)';E={[math]::Round($_.Free/1GB,1)}} -AutoSize

Write-Host "`n=== LARGEST FOLDERS IN USER PROFILE ===" -ForegroundColor Cyan
$userFolders = @(
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Documents",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Videos",
    "$env:USERPROFILE\Pictures",
    "$env:USERPROFILE\.vscode",
    "$env:USERPROFILE\AppData\Local",
    "$env:USERPROFILE\AppData\Roaming",
    "$env:LOCALAPPDATA\npm-cache",
    "$env:LOCALAPPDATA\yarn",
    "$env:LOCALAPPDATA\pnpm",
    "$env:APPDATA\npm",
    "$env:TEMP",
    "C:\Windows\Temp"
)

foreach ($folder in $userFolders) {
    if (Test-Path $folder) {
        $size = (Get-ChildItem -Path $folder -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $sizeGB = [math]::Round($size/1GB, 2)
        if ($sizeGB -gt 0.1) {
            Write-Host "$folder : $sizeGB GB"
        }
    }
}

Write-Host "`n=== NODE_MODULES FOLDERS (potential cleanup) ===" -ForegroundColor Cyan
Get-ChildItem -Path "C:\Development" -Filter "node_modules" -Recurse -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $size = (Get-ChildItem -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $sizeGB = [math]::Round($size/1GB, 2)
    if ($sizeGB -gt 0.1) {
        Write-Host "$($_.FullName) : $sizeGB GB"
    }
}

Write-Host "`n=== LARGE FILES (>500MB) in Development ===" -ForegroundColor Cyan
Get-ChildItem -Path "C:\Development" -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 500MB } | Sort-Object Length -Descending | Select-Object @{N='Size(MB)';E={[math]::Round($_.Length/1MB,0)}}, FullName -First 20 | Format-Table -AutoSize

Write-Host "`n=== SAFE CLEANUP RECOMMENDATIONS ===" -ForegroundColor Green
Write-Host "1. Temp files: Run 'Disk Cleanup' (cleanmgr.exe)"
Write-Host "2. npm cache: npm cache clean --force"
Write-Host "3. Unused node_modules: Delete from old/unused projects"
Write-Host "4. Windows Update cleanup: Run Disk Cleanup as Admin"
Write-Host "5. Browser caches: Clear from browser settings"
