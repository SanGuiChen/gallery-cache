param(
  [switch]$SkipInstall,
  [switch]$SkipVerify
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host ""
  Write-Host "== $message ==" -ForegroundColor Cyan
}

function Write-Ok($message) {
  Write-Host "OK   $message" -ForegroundColor Green
}

function Write-Warn($message) {
  Write-Host "WARN $message" -ForegroundColor Yellow
}

function Write-Fail($message) {
  Write-Host "FAIL $message" -ForegroundColor Red
}

function Test-Command($name) {
  return $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Invoke-CheckedCommand($label, $filePath, $arguments) {
  Write-Step $label
  Write-Host "$filePath $arguments"
  & $filePath $arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$label failed with exit code $LASTEXITCODE"
  }
}

function Install-WithWinget($id, $displayName, $extraArgs = "") {
  if (-not (Test-Command "winget")) {
    throw "winget is required to install $displayName automatically. Please install App Installer from Microsoft Store."
  }

  Write-Step "Installing $displayName"
  $args = @(
    "install",
    "--id", $id,
    "--exact",
    "--accept-source-agreements",
    "--accept-package-agreements"
  )

  if ($extraArgs) {
    $args += $extraArgs.Split(" ")
  }

  & winget @args
  if ($LASTEXITCODE -ne 0) {
    throw "winget failed while installing $displayName"
  }
}

function Refresh-Path {
  $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
  $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$machinePath;$userPath"
}

$workspace = Split-Path -Parent $PSScriptRoot
Set-Location $workspace

Write-Host "Gallery Cache Windows setup" -ForegroundColor Magenta
Write-Host "Workspace: $workspace"

Write-Step "Checking tools"

if (-not (Test-Command "node")) {
  if ($SkipInstall) {
    throw "Node.js is missing. Re-run without -SkipInstall or install Node.js 20+ manually."
  }
  Install-WithWinget "OpenJS.NodeJS.LTS" "Node.js LTS"
  Refresh-Path
} else {
  Write-Ok "Node.js already installed: $(node -v)"
}

if (-not (Test-Command "npm")) {
  throw "npm is unavailable even though Node.js is present. Please reinstall Node.js."
} else {
  Write-Ok "npm already installed: $(npm -v)"
}

if (-not (Test-Command "rustc")) {
  if ($SkipInstall) {
    throw "Rust is missing. Re-run without -SkipInstall or install Rust manually from https://rustup.rs."
  }
  Install-WithWinget "Rustlang.Rustup" "Rustup"
  Refresh-Path
} else {
  Write-Ok "Rust already installed: $(rustc -V)"
}

if (-not (Test-Command "cargo")) {
  throw "Cargo is unavailable even though Rust is present. Open a new terminal and retry."
} else {
  Write-Ok "Cargo already installed: $(cargo -V)"
}

Write-Step "Installing JavaScript dependencies"
& npm install
if ($LASTEXITCODE -ne 0) {
  throw "npm install failed"
}

Write-Step "Running environment doctor"
& npm run doctor
if ($LASTEXITCODE -ne 0) {
  throw "npm run doctor failed"
}

if (-not $SkipVerify) {
  Write-Step "Running repository verification"
  & npm run verify
  if ($LASTEXITCODE -ne 0) {
    throw "npm run verify failed"
  }
} else {
  Write-Warn "Skipped verification because -SkipVerify was provided."
}

Write-Host ""
Write-Host "Setup completed." -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Start desktop development with: npm run tauri dev"
Write-Host "2. Give your code agent this instruction:"
Write-Host '   "请先阅读仓库根目录的 AGENTS.md，再运行 npm run doctor。完成修改后必须运行 npm run verify。"'
