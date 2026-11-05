const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./seed/seedData');

const authRoutes = require('./routes/authRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const taskRoutes = require('./routes/taskRoutes');
const staffRoutes = require('./routes/staffRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');

const app = express();
const server = http.createServer(app);

// Dynamic CORS for Render + Vercel
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost, vercel deployments, and custom domain
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      (process.env.CLIENT_URL && origin.startsWith(process.env.CLIENT_URL))
    ) {
      return callback(null, true);
    }
    // Fallback permit all origins for civic public access
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Fallback polling support on cloud hosts
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attach Socket.io to express app for controllers
app.set('io', io);

// Health check endpoints for Render cloud monitoring
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Sanity Management Public Restroom & Sanitation API',
    version: '2.0.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'Sanity Management Platform API Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Socket.io Real-time connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another process.`);
    console.error(`👉 Close the process using port ${PORT} or update PORT in server/.env\n`);
  } else {
    console.error('[Server Error]:', err);
  }
});

// Start Server after connecting to DB and initializing Admin
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Sanity Management Production Server running on port ${PORT}`);
      console.log(`🌐 API base: http://localhost:${PORT}/api`);
      console.log(`📡 WebSocket server ready for real-time telemetry`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
