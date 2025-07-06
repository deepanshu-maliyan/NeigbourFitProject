# NeighborFit Project - Clean and Package Script
Write-Host "Cleaning up NeighborFit project..." -ForegroundColor Green

# Remove temporary files
$filesToRemove = @(
    "COMPLETION_SUMMARY.md",
    "PROJECT_SUMMARY.md", 
    "GIT_CONFIGURATION.md",
    "SETUP_EMAIL.md",
    "SETUP_EMAIL_NEW.md",
    "SHARING_CHECKLIST.md",
    "create-clean-zip.ps1",
    "create-complete-package.ps1",
    "create-final-zip.ps1",
    "package-creator.ps1",
    "NeighborFit-Complete-Package.zip",
    "NeighborFit-WithEnvLocal.zip",
    "temp_package"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "Removing: $file" -ForegroundColor Yellow
        Remove-Item $file -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Cleanup completed!" -ForegroundColor Green

# Create zip package
Write-Host "Creating NeighborFit package..." -ForegroundColor Green

$zipName = "neighborfit-project.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

# Items to include
$itemsToInclude = @(
    ".env.local",
    ".gitignore", 
    ".gitattributes",
    "app",
    "components",
    "components.json",
    "hooks",
    "INSTALLATION.md",
    "lib",
    "MATCHING_ALGORITHM.md",
    "middleware.ts",
    "next-env.d.ts",
    "next.config.mjs",
    "package.json",
    "pnpm-lock.yaml", 
    "postcss.config.mjs",
    "public",
    "README.md",
    "scripts",
    "styles",
    "tailwind.config.ts",
    "tsconfig.json",
    "types"
)

# Create temp directory
$tempDir = "temp_for_zip"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy items
foreach ($item in $itemsToInclude) {
    if (Test-Path $item) {
        Write-Host "Including: $item" -ForegroundColor Cyan
        if (Test-Path $item -PathType Container) {
            Copy-Item $item -Destination $tempDir -Recurse -Force
        } else {
            Copy-Item $item -Destination $tempDir -Force
        }
    }
}

# Create zip
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force
Remove-Item $tempDir -Recurse -Force

Write-Host "Package created: $zipName" -ForegroundColor Green
Write-Host "Ready to share! Recipients can run 'pnpm install' and 'pnpm dev'" -ForegroundColor Blue
