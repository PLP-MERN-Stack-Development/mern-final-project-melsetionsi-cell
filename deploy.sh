#!/bin/bash

echo "Building and deploying Fitness Tracker with MongoDB Atlas..."

# Check if environment file exists
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found!"
    echo "Please create .env.production with your MongoDB Atlas connection string and other environment variables."
    exit 1
fi

# Load environment variables
export $(cat .env.production | xargs)

# Build and start containers
docker-compose down
docker-compose up --build -d

echo "Deployment completed!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "Database: MongoDB Atlas"
echo ""
echo "Make sure your MongoDB Atlas cluster is properly configured:"
echo "1. Network Access: Add your IP address to the whitelist"
echo "2. Database Access: Create a user with read/write permissions"
echo "3. Connection String: Update MONGODB_ATLAS_URI in .env.production"
