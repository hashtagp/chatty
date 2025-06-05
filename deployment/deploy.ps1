# Multi-Server Deployment Scripts for Windows
# Chatty Microservices Architecture

Write-Host "🚀 Chatty Multi-Server Deployment Scripts" -ForegroundColor Green

function Show-Help {
    Write-Host "`n📋 Available Commands:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 auth          - Deploy Auth Service only" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 message       - Deploy Message Service only" -ForegroundColor Cyan  
    Write-Host "  .\deploy.ps1 nginx         - Deploy Nginx Proxy only" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 test          - Test deployment" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 stop auth     - Stop Auth Service" -ForegroundColor Magenta
    Write-Host "  .\deploy.ps1 stop message  - Stop Message Service" -ForegroundColor Magenta
    Write-Host "  .\deploy.ps1 stop nginx    - Stop Nginx Proxy" -ForegroundColor Magenta
    Write-Host "  .\deploy.ps1 help          - Show this help" -ForegroundColor White
}

function Deploy-AuthService {
    Write-Host "`n🔐 Deploying Auth Service..." -ForegroundColor Yellow
    if (Test-Path ".env") {
        docker-compose -f docker-compose.auth.yml up --build -d
        Write-Host "✅ Auth Service deployed on port 3001" -ForegroundColor Green
    } else {
        Write-Host "❌ .env file not found. Copy .env.production to .env and configure it." -ForegroundColor Red
    }
}

function Deploy-MessageService {
    Write-Host "`n💬 Deploying Message Service..." -ForegroundColor Yellow
    if (Test-Path ".env") {
        docker-compose -f docker-compose.message.yml up --build -d
        Write-Host "✅ Message Service deployed on port 3002" -ForegroundColor Green
    } else {
        Write-Host "❌ .env file not found. Copy .env.production to .env and configure it." -ForegroundColor Red
    }
}

function Deploy-NginxProxy {
    Write-Host "`n🌐 Deploying Nginx Proxy..." -ForegroundColor Yellow
    if (Test-Path ".env") {
        docker-compose -f docker-compose.nginx.yml up --build -d
        Write-Host "✅ Nginx Proxy deployed on port 80" -ForegroundColor Green
    } else {
        Write-Host "❌ .env file not found. Copy .env.production to .env and configure IP addresses." -ForegroundColor Red
    }
}

function Test-Deployment {
    Write-Host "`n🧪 Testing Deployment..." -ForegroundColor Yellow
    
    $mode = Read-Host "Test mode? (local/nginx)"
    if ($mode -eq "nginx") {
        $nginxUrl = Read-Host "Nginx server URL (e.g., http://192.168.1.100)"
        $env:DEPLOYMENT_MODE = "nginx"
        $env:NGINX_BASE_URL = $nginxUrl
    }
    
    node test-microservices.js
}

function Stop-Service {
    param($service)
    
    switch ($service) {
        "auth" {
            Write-Host "`n🛑 Stopping Auth Service..." -ForegroundColor Yellow
            docker-compose -f docker-compose.auth.yml down
            Write-Host "✅ Auth Service stopped" -ForegroundColor Green
        }
        "message" {
            Write-Host "`n🛑 Stopping Message Service..." -ForegroundColor Yellow
            docker-compose -f docker-compose.message.yml down
            Write-Host "✅ Message Service stopped" -ForegroundColor Green
        }
        "nginx" {
            Write-Host "`n🛑 Stopping Nginx Proxy..." -ForegroundColor Yellow
            docker-compose -f docker-compose.nginx.yml down
            Write-Host "✅ Nginx Proxy stopped" -ForegroundColor Green
        }
        default {
            Write-Host "❌ Unknown service: $service" -ForegroundColor Red
            Write-Host "Available services: auth, message, nginx" -ForegroundColor Yellow
        }
    }
}

# Main script logic
if ($args.Count -eq 0) {
    Show-Help
    exit
}

switch ($args[0]) {
    "auth" { Deploy-AuthService }
    "message" { Deploy-MessageService }
    "nginx" { Deploy-NginxProxy }
    "test" { Test-Deployment }
    "stop" { 
        if ($args.Count -gt 1) {
            Stop-Service $args[1]
        } else {
            Write-Host "❌ Please specify service to stop: auth, message, or nginx" -ForegroundColor Red
        }
    }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Unknown command: $($args[0])" -ForegroundColor Red
        Show-Help
    }
}
