$env:PATH = "$env:USERPROFILE\nodejs;" + $env:PATH
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting MalGuard Cybersecurity SOC Development Server" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
npm run dev
