
# =========================================================
# EMLA ASISTANI - GUVENLI BASLATMA SCRIPTI
# =========================================================
$ErrorActionPreference = "SilentlyContinue"

function Kill-PortOwner {
    param([int]$port)
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pid_val = $conn.OwningProcess
            if ($pid_val -gt 0) {
                Write-Host "Port $port uzerinde calisan islem sonlandiriliyor (PID: $pid_val)..." -ForegroundColor Yellow
                Stop-Process -Id $pid_val -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   EMLAK ASISTANI BASLATILIYOR..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. TEMIZLIK: Eski islemleri kapat
Write-Host "[1/5] Port temizligi yapiliyor..." -ForegroundColor Gray
Kill-PortOwner 5555
Kill-PortOwner 3000
Start-Sleep -Seconds 1

# 2. BACKEND BASLAT
Write-Host "[2/5] Backend (Python API) baslatiliyor..." -ForegroundColor Green
$backendProcess = Start-Process python -ArgumentList "main.py" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Normal
if (!$backendProcess) {
    Write-Error "Backend baslatilamadi! Python kurulu mu?"
    exit
}

# 3. SAGLIK KONTROLU (Port Dinleme)
Write-Host "[3/5] Backend servisi bekleniyor..." -ForegroundColor Gray
$maxRetries = 30
$retryCount = 0
$connected = $false

while ($retryCount -lt $maxRetries) {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("127.0.0.1", 5555)
        $connected = $true
        $tcp.Close()
        break
    } catch {
        $retryCount++
        Write-Host -NoNewline "."
        Start-Sleep -Milliseconds 500
    }
}
Write-Host "" 

if ($connected) {
    Write-Host "Backend HAZIR!" -ForegroundColor Green
} else {
    Write-Host "UYARI: Backend henuz yanit vermedi ama devam ediliyor..." -ForegroundColor Yellow
}

# 4. FRONTEND BASLAT
Write-Host "[4/5] Frontend (Dashboard) baslatiliyor..." -ForegroundColor Green
$dashboardDir = Join-Path $PSScriptRoot "dashboard"
$frontendProcess = Start-Process cmd -ArgumentList "/k npm run dev" -WorkingDirectory $dashboardDir -PassThru -WindowStyle Normal

if (!$frontendProcess) {
    Write-Error "Frontend baslatilamadi! NPM kurulu mu?"
    exit
}

# 5. TARAYICI
Write-Host "[5/5] Tarayici aciliyor..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   SISTEM BASARIYLA ACILDI" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Pencereleri kapatirsaniz sistem durur."
Start-Sleep -Seconds 5
