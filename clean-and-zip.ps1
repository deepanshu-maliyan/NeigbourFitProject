# Clean and zip script for NeighborFit project

# Create a temporary directory for the clean version
$tempDir = "neighborfit-clean"
Write-Host "Creating temporary directory: $tempDir"
New-Item -ItemType Directory -Force -Path $tempDir

# Copy all files except excluded ones
Write-Host "Copying project files..."
$excludeList = @(
    "node_modules",
    ".next",
    ".env",
    ".env.local",
    ".vscode",
    ".idea",
    ".DS_Store",
    "$tempDir"
)

Get-ChildItem -Path "." -Exclude $excludeList | Copy-Item -Destination $tempDir -Recurse -Force

# Create the zip file
$zipFile = "neighborfit-project.zip"
Write-Host "Creating zip file: $zipFile"
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -Force

# Clean up temporary directory
Write-Host "Cleaning up temporary directory..."
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Done! Project has been cleaned and zipped to: $zipFile"
Write-Host "Note: After unzipping, run 'pnpm install' to install dependencies." 