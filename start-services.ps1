# Microservices Startup Script for Windows
Write-Host "Starting Chatty Microservices..." -ForegroundColor Green

# Start Auth Service
Write-Host "Starting Auth Service on port 3001..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'd:\freelance\chatty\auth-service'; npm run dev" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 2

# Start Message Service
Write-Host "Starting Message Service on port 3002..." -ForegroundColor Yellow  
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'd:\freelance\chatty\message-service'; npm run dev" -WindowStyle Normal

# Wait for services to start
Start-Sleep -Seconds 5

Write-Host "Microservices started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "Auth Service: http://localhost:3001" -ForegroundColor White
Write-Host "Message Service: http://localhost:3002" -ForegroundColor White
Write-Host ""
Write-Host "Health Checks:" -ForegroundColor Cyan
Write-Host "Auth Service: http://localhost:3001/health" -ForegroundColor White
Write-Host "Message Service: http://localhost:3002/health" -ForegroundColor White
Write-Host ""
Write-Host "To configure Nginx, see nginx/nginx.conf" -ForegroundColor Yellow
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
