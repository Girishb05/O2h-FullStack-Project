require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to database and then mount routes
connectDB().then(() => {
  // Safe to require routes now because the database and sequelize instance are initialized
  const taskRoutes = require('./routes/taskRoutes');
  app.use('/api/tasks', taskRoutes);

  // Health check
  app.get('/', (req, res) => {
    res.json({ message: '🚀 Task Manager API is running' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
