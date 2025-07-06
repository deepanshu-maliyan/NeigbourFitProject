Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("neighborfit-project.zip")
$entries = $zip.Entries | ForEach-Object { $_.Name }
$zip.Dispose()
Write-Host "Key files in the zip package:"
$entries | Where-Object { $_ -like "*.env*" -or $_ -like "*README*" -or $_ -like "*package.json*" -or $_ -like "*tsconfig*" } | ForEach-Object { Write-Host "  $_" }
Write-Host "`nTotal files: $($entries.Count)"
