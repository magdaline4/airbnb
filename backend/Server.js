const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database'); // your existing DB connection
const errorHandler = require('./middleware/errorHandler');

// Routes
const listingRoutes = require("./routes/listings.js");
const roomsRoutes = require("./routes/rooms.js");
const amenitiesRoutes = require('./routes/amenities');
const amenitiesitemRoutes = require('./routes/amenitiesItem.js');

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Allow larger request body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Debugging
console.log("MONGO_URI from .env =>", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is undefined!");
  process.exit(1);
}

// ✅ Connect to MongoDB
connectDB();

// ✅ Use routes
app.use("/api/listings", listingRoutes);
app.use("/api/rooms", roomsRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/amenitiesitem', amenitiesitemRoutes);
app.use("/api/rooms", roomsRoutes);


// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 routes
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware
app.use(errorHandler);

// ✅ Start server only if not running on Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
