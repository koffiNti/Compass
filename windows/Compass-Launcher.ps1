# Compass AI OS Windows PowerShell Launcher
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Launching Compass AI Personal Operating System     " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

# 1. Start Python FastAPI Backend Server
Write-Host "-> Starting Python Backend Server..." -ForegroundColor Yellow
$BackendPath = Join-Path $ScriptDir "..\backend"
$BackendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    $env:PYTHONPATH = $path
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
} -ArgumentList $BackendPath

# 2. Start Electron Native Desktop Client
Write-Host "-> Launching Native Electron Window..." -ForegroundColor Green
$FrontendPath = Join-Path $ScriptDir "..\frontend"
Set-Location $FrontendPath

# Check if npm dev server or built bundle is ready
if (Test-Path "dist\index.html") {
    Set-Location $ScriptDir
    npx electron .
} else {
    Write-Host "-> Building production frontend bundle..." -ForegroundColor Yellow
    npm run build
    Set-Location $ScriptDir
    npx electron .
}

# Cleanup on close
Stop-Job $BackendJob
Remove-Job $BackendJob
Write-Host "Compass AI OS Shutdown Complete." -ForegroundColor Cyan
