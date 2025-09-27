const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());

// Debugging
console.log("MONGO_URI from .env =>", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is undefined!");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// ✅ Use routes correctly
const listingRoutes = require("./routes/listings.js");
app.use("/api/listings", listingRoutes);

const roomsRoutes = require("./routes/rooms.js");
app.use("/api/rooms", roomsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'DINOSER API is running!',
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

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;