Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $repoRoot 'backend'
$envPath = Join-Path $backendPath '.env'
$pythonExe = Join-Path (Split-Path $repoRoot -Parent) '.venv\Scripts\python.exe'

if (-not (Test-Path $pythonExe)) {
    throw "Python executable not found at $pythonExe"
}

if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        $line = $_.Trim()

        if (-not $line -or $line.StartsWith('#')) {
            return
        }

        $parts = $line -split '=', 2
        if ($parts.Length -ne 2) {
            return
        }

        $name = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"')
        Set-Item -Path "Env:$name" -Value $value
    }
}

Set-Location $backendPath
$env:PYTHONPATH = '.'

Write-Host "Starting backend on http://127.0.0.1:8001 using $pythonExe"
& $pythonExe -m uvicorn app.main:app --host 127.0.0.1 --port 8001