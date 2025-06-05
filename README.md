# ✨ Full Stack Realtime Chat App - Microservices Architecture ✨

![Demo App](/frontend/public/screenshot-for-readme.png)

[Video Tutorial on Youtube](https://youtu.be/ntKkVrQqBYY)

## 🏗️ Architecture

This application has been migrated from a monolithic backend to a **microservices architecture** with two independent services:

### 🔐 Auth Service (Port 3001)
- User authentication and authorization
- JWT token generation and validation
- User profile management
- Registration and login endpoints

### 💬 Message Service (Port 3002)  
- Real-time messaging with Socket.IO
- Message history and user sidebar
- Cross-service JWT validation
- WebSocket connections for live chat

## 🌟 Highlights:

- 🏗️ **Microservices Architecture**: Independent, scalable services
- 🌟 Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI + Docker + Nginx
- 🎃 Authentication && Authorization with JWT (shared between services)
- 👾 Real-time messaging with Socket.io
- 🚀 Online user status
- 👌 Global state management with Zustand
- 🐞 Error handling both on the server and on the client
- ⭐ At the end Deployment like a pro for FREE!
- ⏳ And much more!

### Setup .env file

```js
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
