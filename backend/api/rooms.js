import mongoose from "mongoose";
import Room from "../models/Room.js";

// MongoDB connection caching for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Important for serverless
      maxPoolSize: 10, // Reduce pool size for serverless
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Connect to MongoDB
    await connectDB();

    if (req.method === "GET") {
      const rooms = await Room.find().limit(100); // Add limit for safety
      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms
      });
      
    } else if (req.method === "POST") {
      // No need to parse req.body - Vercel automatically parses JSON
      const roomData = req.body;
      
      // Validate required fields (adjust based on your schema)
      if (!roomData.title || !roomData.type || !roomData.price) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: title, type, price"
        });
      }

      const room = new Room(roomData);
      await room.save();
      
      res.status(201).json({
        success: true,
        data: room
      });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
    }
    
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message
    });
  }
}