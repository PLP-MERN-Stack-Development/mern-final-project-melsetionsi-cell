const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.userId = user._id;
    socket.username = user.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.username} connected`);

  // Join user to their personal room
  socket.join(socket.userId.toString());

  // Handle workout completion
  socket.on('workout_completed', (data) => {
    // Broadcast to user's room
    socket.to(socket.userId.toString()).emit('workout_update', {
      type: 'WORKOUT_COMPLETED',
      data: data,
      message: `Workout "${data.workoutName}" completed!`,
      timestamp: new Date()
    });
  });

  // Handle goal achievement
  socket.on('goal_achieved', (data) => {
    socket.to(socket.userId.toString()).emit('goal_update', {
      type: 'GOAL_ACHIEVED',
      data: data,
      message: `Congratulations! You achieved: ${data.goalName}`,
      timestamp: new Date()
    });
  });

  // Handle real-time metrics update
  socket.on('metrics_updated', (data) => {
    socket.to(socket.userId.toString()).emit('metrics_update', {
      type: 'METRICS_UPDATED',
      data: data,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { io };
