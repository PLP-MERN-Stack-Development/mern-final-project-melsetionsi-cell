#!/bin/bash

echo "Building and deploying Fitness Tracker..."

# Build and start containers
docker-compose down
docker-compose up --build -d

echo "Deployment completed!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "MongoDB: localhost:27017"
