#!/bin/bash

# Microservices Startup Script
echo "Starting Chatty Microservices..."

# Start Auth Service
echo "Starting Auth Service on port 3001..."
cd auth-service
npm run dev &
AUTH_PID=$!

# Start Message Service  
echo "Starting Message Service on port 3002..."
cd ../message-service
npm run dev &
MESSAGE_PID=$!

# Wait for services to start
sleep 5

echo "Microservices started successfully!"
echo "Auth Service PID: $AUTH_PID"
echo "Message Service PID: $MESSAGE_PID"
echo ""
echo "Service URLs:"
echo "Auth Service: http://localhost:3001"
echo "Message Service: http://localhost:3002"
echo ""
echo "Health Checks:"
echo "Auth Service: http://localhost:3001/health"
echo "Message Service: http://localhost:3002/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait
