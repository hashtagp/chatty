# Chatty Microservices Setup

This document provides setup instructions for the microservices architecture.

## Architecture Overview

- **Auth Service** (Port 3001): Handles authentication, user registration, login, profile management
- **Message Service** (Port 3002): Handles messaging, user sidebar, real-time chat via Socket.IO
- **Nginx** (Port 80): Reverse proxy routing requests to appropriate services

## Quick Start

### 1. Environment Setup

Copy the environment variables from your original backend to both services:

**Auth Service (.env):**
```bash
AUTH_SERVICE_PORT=3001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Message Service (.env):**
```bash
MESSAGE_SERVICE_PORT=3002
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Install Dependencies

```bash
# Auth Service
cd auth-service
npm install

# Message Service
cd ../message-service
npm install
```

### 3. Start Services

```bash
# Terminal 1 - Auth Service
cd auth-service
npm run dev

# Terminal 2 - Message Service
cd message-service
npm run dev

# Terminal 3 - Nginx (if installed)
nginx -c /path/to/chatty/nginx/nginx.conf
```

### 4. Update Frontend Configuration

Update your frontend to use Nginx as the API endpoint:

```javascript
// Instead of http://localhost:3000
const API_BASE_URL = "http://localhost"; // Nginx routes to services
```

## Service Endpoints

### Auth Service (via Nginx: /api/auth/*)
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login  
- POST `/api/auth/logout` - User logout
- PUT `/api/auth/update-profile` - Update user profile
- GET `/api/auth/check` - Check authentication status

### Message Service (via Nginx: /api/messages/*)
- GET `/api/messages/users` - Get users for sidebar
- GET `/api/messages/:id` - Get messages with specific user
- POST `/api/messages/send/:id` - Send message to user

### Socket.IO (via Nginx: /socket.io/*)
- Real-time messaging handled by message service

## Health Checks

- Auth Service: `http://localhost:3001/health`
- Message Service: `http://localhost:3002/health`
- Nginx: `http://localhost/health`

## Development

Each service can be developed independently:

```bash
# Auth Service Development
cd auth-service
npm run dev

# Message Service Development  
cd message-service
npm run dev
```

## Production Deployment

1. Build both services
2. Set production environment variables
3. Configure Nginx reverse proxy
4. Deploy services to separate containers/servers
5. Update frontend to use production Nginx endpoint

## Migration Notes

- Both services share the same MongoDB database
- JWT tokens are compatible between services
- Original monolithic backend can be kept as backup
- Frontend only needs to update API base URL to Nginx endpoint
