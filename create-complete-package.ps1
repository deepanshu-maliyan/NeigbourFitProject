# NeighborFit Complete Package Creator
# This script creates a complete zip package including .env.local for easy sharing

Write-Host "🚀 Creating NeighborFit Complete Package..." -ForegroundColor Green

# Set the project directory and output file
$projectDir = Get-Location
$outputFile = Join-Path $projectDir "NeighborFit-Complete-Package.zip"

Write-Host "📁 Project Directory: $projectDir" -ForegroundColor Cyan
Write-Host "📦 Output File: $outputFile" -ForegroundColor Cyan

# Remove existing zip if it exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
    Write-Host "🗑️  Removed existing zip file" -ForegroundColor Yellow
}

# Create list of files and directories to include
$filesToInclude = @(
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

# Create temporary directory for packaging
$tempDir = Join-Path $projectDir "temp_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "📋 Copying project files..." -ForegroundColor Cyan

# Copy each file/directory to temp directory
foreach ($item in $filesToInclude) {
    $sourcePath = Join-Path $projectDir $item
    $destPath = Join-Path $tempDir $item
    
    if (Test-Path $sourcePath) {
        if (Test-Path $sourcePath -PathType Container) {
            # Copy directory
            Copy-Item $sourcePath $destPath -Recurse -Force
            Write-Host "  ✅ Copied directory: $item" -ForegroundColor Green
        } else {
            # Copy file
            Copy-Item $sourcePath $destPath -Force
            Write-Host "  ✅ Copied file: $item" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  Item not found: $item" -ForegroundColor Yellow
    }
}

# Create README for the package
$packageReadme = @'
# NeighborFit - Complete Package

## Quick Start Instructions

This package contains everything needed to run the NeighborFit application locally.

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Setup Commands
1. Extract this zip file
2. Open terminal in the extracted folder
3. Run: pnpm install
4. Run: pnpm dev
5. Open browser to: http://localhost:3000

### What's Included
- Complete source code
- All dependencies (package.json)
- Environment configuration (.env.local)
- Database setup scripts
- Complete documentation

### Environment Variables
All necessary environment variables are pre-configured in .env.local:
- Supabase URL and keys
- Database credentials
- JWT secrets

### Database
The application connects to a pre-configured Supabase database with:
- 42 neighborhoods with complete scoring
- User authentication system
- Row Level Security (RLS) policies

### Features
- User authentication (signup/login)
- Interactive 13-question lifestyle quiz  
- Advanced matching algorithm (40-95% score range)
- Personalized neighborhood recommendations
- Responsive design for all devices

### Documentation
- README.md - Project overview and setup
- INSTALLATION.md - Detailed setup guide
- MATCHING_ALGORITHM.md - Algorithm documentation

### Support
If you encounter any issues:
1. Ensure Node.js 18+ is installed
2. Try npm install if pnpm is not available
3. Check that all files extracted properly
4. Verify network connection for database access

## Development
- Start dev server: pnpm dev
- Build for production: pnpm build
- Run production: pnpm start

Enjoy exploring neighborhoods with NeighborFit!
'@

$packageReadmePath = Join-Path $tempDir "PACKAGE_README.md"
$packageReadme | Out-File -FilePath $packageReadmePath -Encoding UTF8

Write-Host "📄 Created package README" -ForegroundColor Green

# Create the zip file
Write-Host "🗜️  Creating zip archive..." -ForegroundColor Cyan

try {
    Compress-Archive -Path "$tempDir\*" -DestinationPath $outputFile -Force
    Write-Host "✅ Successfully created: NeighborFit-Complete-Package.zip" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creating zip file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force
Write-Host "🧹 Cleaned up temporary files" -ForegroundColor Cyan

# Get file size
$fileSize = [math]::Round((Get-Item $outputFile).Length / 1MB, 2)
Write-Host "📊 Package size: $fileSize MB" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Package created successfully!" -ForegroundColor Green
Write-Host "📦 File: NeighborFit-Complete-Package.zip" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Instructions for recipient:" -ForegroundColor Cyan
Write-Host "1. Extract the zip file" -ForegroundColor White
Write-Host "2. Open terminal in extracted folder" -ForegroundColor White  
Write-Host "3. Run: pnpm install" -ForegroundColor White
Write-Host "4. Run: pnpm dev" -ForegroundColor White
Write-Host "5. Open browser to: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: This package includes environment variables with database credentials." -ForegroundColor Yellow
Write-Host "   Only share with trusted recipients!" -ForegroundColor Yellow
