#!/usr/bin/env pwsh

Write-Host "Creating NeighborFit Complete Package..." -ForegroundColor Green

# Define paths
$projectDir = Get-Location
$zipName = "NeighborFit-Complete-Package.zip"
$zipPath = Join-Path $projectDir $zipName

# Remove existing zip if it exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed existing zip file" -ForegroundColor Yellow
}

Write-Host "Creating zip with all project files including .env.local..." -ForegroundColor Cyan

# Files and directories to include
$includes = @(
    "app",
    "components", 
    "hooks",
    "lib",
    "public",
    "scripts",
    "styles",
    "types",
    ".env.local",
    ".gitattributes", 
    ".gitignore",
    "components.json",
    "INSTALLATION.md",
    "MATCHING_ALGORITHM.md",
    "middleware.ts",
    "next-env.d.ts", 
    "next.config.mjs",
    "package.json",
    "pnpm-lock.yaml",
    "postcss.config.mjs",
    "README.md",
    "tailwind.config.ts",
    "tsconfig.json"
)

# Create zip file directly with selected items
$itemsToZip = @()
foreach ($item in $includes) {
    if (Test-Path $item) {
        $itemsToZip += $item
        Write-Host "  Added: $item" -ForegroundColor Green
    } else {
        Write-Host "  Missing: $item" -ForegroundColor Yellow
    }
}

# Create the zip archive
Compress-Archive -Path $itemsToZip -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    $fileSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "Successfully created package!" -ForegroundColor Green
    Write-Host "File: $zipName" -ForegroundColor Yellow
    Write-Host "Size: $fileSize MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Instructions for recipient:" -ForegroundColor Cyan
    Write-Host "1. Extract zip file" -ForegroundColor White
    Write-Host "2. Open terminal in extracted folder" -ForegroundColor White
    Write-Host "3. Run: pnpm install" -ForegroundColor White
    Write-Host "4. Run: pnpm dev" -ForegroundColor White
    Write-Host "5. Open browser to: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "WARNING: This package includes .env.local with database credentials!" -ForegroundColor Red
} else {
    Write-Host "Failed to create zip file" -ForegroundColor Red
}
