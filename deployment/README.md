# 🚀 Multi-Server Deployment Guide

## Overview

This guide explains how to deploy the Chatty microservices across three separate servers:

- **Server 1**: Nginx Reverse Proxy
- **Server 2**: Auth Service  
- **Server 3**: Message Service

## Architecture

```
Internet
    ↓
┌─────────────────┐
│   Server 1      │
│  Nginx Proxy    │  ← Entry point (Port 80)
│   (Port 80)     │
└─────────────────┘
    ↓           ↓
┌─────────────┐ ┌─────────────┐
│  Server 2   │ │  Server 3   │
│Auth Service │ │Msg Service  │
│ (Port 3001) │ │ (Port 3002) │
└─────────────┘ └─────────────┘
```

## Prerequisites

### All Servers
- Docker and Docker Compose installed
- Network connectivity between servers
- Firewall rules configured (see Network Configuration)

### Environment Files
1. Copy `.env.production` to each server
2. Update IP addresses in the environment file
3. Ensure all servers have identical JWT_SECRET and database credentials

## Network Configuration

### Firewall Rules Required

**Server 1 (Nginx)**:
- Allow inbound: Port 80 (HTTP)
- Allow outbound: Ports 3001, 3002 to auth/message servers

**Server 2 (Auth Service)**:
- Allow inbound: Port 3001 from Nginx server
- Allow outbound: MongoDB Atlas (port 27017)

**Server 3 (Message Service)**:
- Allow inbound: Port 3002 from Nginx server  
- Allow outbound: MongoDB Atlas (port 27017)

## Deployment Steps

### 1. Deploy Auth Service (Server 2)

```bash
# Clone repository
git clone <your-repo-url>
cd chatty

# Copy and configure environment
cp .env.production .env
# Edit .env with correct IP addresses

# Deploy auth service
docker-compose -f docker-compose.auth.yml up -d

# Verify deployment
curl http://localhost:3001/api/auth/health
```

### 2. Deploy Message Service (Server 3)

```bash
# Clone repository  
git clone <your-repo-url>
cd chatty

# Copy and configure environment
cp .env.production .env
# Edit .env with correct IP addresses

# Deploy message service
docker-compose -f docker-compose.message.yml up -d

# Verify deployment
curl http://localhost:3002/api/messages/health
```

### 3. Deploy Nginx Proxy (Server 1)

```bash
# Clone repository
git clone <your-repo-url>
cd chatty

# Copy and configure environment with service IPs
cp .env.production .env
# Edit .env with AUTH_SERVICE_IP and MESSAGE_SERVICE_IP

# Deploy nginx
docker-compose -f docker-compose.nginx.yml up -d

# Verify deployment
curl http://localhost/health
```

## Testing Deployment

### Health Checks

```bash
# Test Nginx proxy
curl http://<nginx-server-ip>/health

# Test Auth service through proxy
curl http://<nginx-server-ip>/api/auth/health

# Test Message service through proxy
curl http://<nginx-server-ip>/api/messages/health
```

### Full Integration Test

```bash
# Update test script with Nginx server IP
# Edit test-microservices.js: 
# const NGINX_BASE_URL = 'http://<nginx-server-ip>';

node test-microservices.js
```

## Environment Variables Reference

### Server 1 (Nginx)
Required in `.env`:
```
AUTH_SERVICE_IP=<auth-server-ip>
MESSAGE_SERVICE_IP=<message-server-ip>
AUTH_SERVICE_PORT=3001
MESSAGE_SERVICE_PORT=3002
NGINX_PORT=80
```

### Server 2 (Auth Service)
Required in `.env`:
```
AUTH_SERVICE_PORT=3001
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<shared-secret>
CLOUDINARY_CLOUD_NAME=<cloudinary-name>
CLOUDINARY_API_KEY=<cloudinary-key>
CLOUDINARY_API_SECRET=<cloudinary-secret>
```

### Server 3 (Message Service)
Required in `.env`:
```
MESSAGE_SERVICE_PORT=3002
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<shared-secret>
CLOUDINARY_CLOUD_NAME=<cloudinary-name>
CLOUDINARY_API_KEY=<cloudinary-key>
CLOUDINARY_API_SECRET=<cloudinary-secret>
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check firewall rules
   - Verify service IPs in environment variables
   - Ensure services are running: `docker ps`

2. **JWT Token Issues**
   - Ensure identical JWT_SECRET across all servers
   - Check token format in network requests

3. **CORS Errors**
   - Update Nginx CORS configuration for your frontend domain
   - Check frontend is pointing to Nginx server IP

4. **Database Connection**
   - Verify MongoDB Atlas URI is correct
   - Check network connectivity to MongoDB Atlas

### Logs and Debugging

```bash
# Check service logs
docker-compose logs -f auth-service    # Auth server
docker-compose logs -f message-service # Message server  
docker-compose logs -f nginx          # Nginx server

# Check service status
docker-compose ps
```

## Scaling Considerations

- **Load Balancing**: Add multiple instances behind a load balancer
- **SSL/TLS**: Configure SSL certificates in Nginx
- **Monitoring**: Add health check monitoring and alerting
- **Backup**: Implement database backup strategies

## Security Recommendations

1. **Network Security**:
   - Use VPN between servers
   - Implement IP whitelisting
   - Use non-standard ports

2. **Application Security**:
   - Enable rate limiting in Nginx
   - Use strong JWT secrets
   - Implement API key authentication

3. **Infrastructure Security**:
   - Keep Docker images updated
   - Use secrets management
   - Enable Docker security scanning
