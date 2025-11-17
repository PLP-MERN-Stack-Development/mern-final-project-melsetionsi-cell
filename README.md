cat > README.md << 'EOF'
# Health & Fitness Tracker

A comprehensive full-stack MERN application for tracking health metrics, workouts, and nutrition with real-time features and data visualization.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Workout Tracking**: Create, edit, and track workouts with exercises
- **Nutrition Logging**: Track meals and macronutrients
- **Health Metrics**: Monitor weight, BMI, sleep, steps, and more
- **Real-time Updates**: Live updates using Socket.io
- **Data Visualization**: Charts and graphs for progress tracking
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Well-structured backend API

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Chart.js for data visualization
- Axios for API calls
- Socket.io-client for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time communication
- bcryptjs for password hashing

### Deployment
- Docker containerization
- Nginx for static file serving
- MongoDB for data persistence

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Or Docker and Docker Compose

### Method 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd health-fitness-tracker
Run the deployment script:

bash
./deploy.sh
Access the application:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

Method 2: Manual Setup
Backend Setup
Navigate to server directory:

bash
cd server
Install dependencies:

bash
npm install
Create .env file:

bash
cp .env.example .env
# Edit .env with your configuration
Start the server:

bash
npm run dev
Frontend Setup
Navigate to client directory:

bash
cd client
Install dependencies:

bash
npm install
Start the development server:

bash
npm start
API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user

PUT /api/auth/profile - Update user profile

Workouts
GET /api/workouts - Get all workouts

POST /api/workouts - Create workout

GET /api/workouts/:id - Get single workout

PUT /api/workouts/:id - Update workout

DELETE /api/workouts/:id - Delete workout

GET /api/workouts/stats/summary - Get workout statistics

Nutrition
GET /api/nutrition - Get nutrition entries

POST /api/nutrition - Create nutrition entry

GET /api/nutrition/:id - Get single entry

PUT /api/nutrition/:id - Update entry

DELETE /api/nutrition/:id - Delete entry

GET /api/nutrition/stats/summary - Get nutrition statistics

Health Metrics
GET /api/health-metrics - Get health metrics

POST /api/health-metrics - Create health metrics

GET /api/health-metrics/:id - Get single metric

PUT /api/health-metrics/:id - Update metric

DELETE /api/health-metrics/:id - Delete metric

GET /api/health-metrics/stats/trends - Get health trends

Testing
Backend Tests
bash
cd server
npm test
Test Coverage
bash
cd server
npm run test:coverage
Deployment
Production Deployment
Set environment variables in production

Build Docker images:

bash
docker-compose -f docker-compose.prod.yml up --build
Or deploy to cloud platform (AWS, Heroku, etc.)

Environment Variables
Backend (.env)
env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
Project Structure
text
health-fitness-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── __tests__/     # Test files
│   └── package.json
├── docker-compose.yml     # Docker configuration
└── README.md
Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

License
This project is licensed under the MIT License.

Support
For support, please open an issue in the GitHub repository or contact the development team.

Note: This is a development version. For production deployment, ensure to:

Use strong JWT secrets

Enable HTTPS

Configure proper CORS settings

Set up database backups

Implement rate limiting

Use environment-specific configurations
EOF