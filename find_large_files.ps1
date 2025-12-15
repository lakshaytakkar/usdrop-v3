# Disk Space Overview
Write-Host "`n=== DISK SPACE OVERVIEW ===" -ForegroundColor Cyan
Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 } | ForEach-Object {
    $used = [math]::Round($_.Used/1GB,2)
    $free = [math]::Round($_.Free/1GB,2)
    $total = $used + $free
    $pctUsed = [math]::Round(($used/$total)*100,1)
    Write-Host "$($_.Name): Drive - Used: $used GB, Free: $free GB, Total: $total GB ($pctUsed% used)"
}

# Find largest files in user profile
Write-Host "`n=== TOP 30 LARGEST FILES IN USER PROFILE ===" -ForegroundColor Cyan
Get-ChildItem -Path $env:USERPROFILE -Recurse -File -ErrorAction SilentlyContinue |
    Sort-Object Length -Descending |
    Select-Object -First 30 |
    ForEach-Object {
        $sizeMB = [math]::Round($_.Length/1MB,2)
        $lastAccess = $_.LastAccessTime.ToString("yyyy-MM-dd")
        Write-Host "$sizeMB MB - $lastAccess - $($_.FullName)"
    }

# Find old unused files (not accessed in 6+ months, larger than 50MB)
Write-Host "`n=== LARGE FILES NOT ACCESSED IN 6+ MONTHS (>50MB) ===" -ForegroundColor Yellow
$sixMonthsAgo = (Get-Date).AddMonths(-6)
Get-ChildItem -Path $env:USERPROFILE -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.LastAccessTime -lt $sixMonthsAgo -and $_.Length -gt 50MB } |
    Sort-Object Length -Descending |
    Select-Object -First 30 |
    ForEach-Object {
        $sizeMB = [math]::Round($_.Length/1MB,2)
        $lastAccess = $_.LastAccessTime.ToString("yyyy-MM-dd")
        Write-Host "$sizeMB MB - Last Access: $lastAccess - $($_.FullName)"
    }

# Check common large file locations
Write-Host "`n=== DOWNLOADS FOLDER - LARGE FILES ===" -ForegroundColor Cyan
$downloads = Join-Path $env:USERPROFILE "Downloads"
if (Test-Path $downloads) {
    Get-ChildItem -Path $downloads -File -ErrorAction SilentlyContinue |
        Sort-Object Length -Descending |
        Select-Object -First 15 |
        ForEach-Object {
            $sizeMB = [math]::Round($_.Length/1MB,2)
            $lastAccess = $_.LastAccessTime.ToString("yyyy-MM-dd")
            Write-Host "$sizeMB MB - $lastAccess - $($_.Name)"
        }
}

# Check temp folders
Write-Host "`n=== TEMP FOLDERS SIZE ===" -ForegroundColor Yellow
$tempPaths = @(
    $env:TEMP,
    (Join-Path $env:USERPROFILE "AppData\Local\Temp"),
    "C:\Windows\Temp"
)
foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        $size = (Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $sizeGB = [math]::Round($size/1GB,2)
        Write-Host "$path - $sizeGB GB"
    }
}

# Check recycle bin size
Write-Host "`n=== RECYCLE BIN ===" -ForegroundColor Yellow
$shell = New-Object -ComObject Shell.Application
$recycleBin = $shell.NameSpace(0xA)
$rbSize = ($recycleBin.Items() | Measure-Object -Property Size -Sum -ErrorAction SilentlyContinue).Sum
if ($rbSize) {
    $rbSizeGB = [math]::Round($rbSize/1GB,2)
    Write-Host "Recycle Bin: $rbSizeGB GB"
}
