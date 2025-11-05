const mongoose = require('mongoose');

// Reuse the same Mongo connection across serverless invocations.
const cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
  }

  try {
    const mongooseInstance = await cached.promise;

    cached.conn = mongooseInstance.connection;

    if (cached.conn.readyState === 1) {
      console.log(`MongoDB connected: ${cached.conn.host}`);
    }

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
