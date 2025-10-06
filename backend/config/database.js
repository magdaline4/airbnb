const mongoose = require('mongoose');

const connection = {};

async function connectDB() {
  if (connection.isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI is not defined in environment variables');
    }

    console.log('🔄 Attempting MongoDB connection...');

    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('✅ MongoDB connected successfully');
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('⛔ MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Provide specific troubleshooting tips
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all)');
      console.log('3. Check database user credentials in MongoDB Atlas');
      console.log('4. Ensure cluster is not paused in MongoDB Atlas');
      console.log('5. Verify MONGO_URI in .env file');
    }
    
    process.exit(1);
  }
}

module.exports = connectDB;