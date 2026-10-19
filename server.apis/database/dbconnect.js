import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config.js';

const dbconnect = async () => {
  const uri = process.env.MONGODB_URI || MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in configuration.");
    return;
  }

  const connectWithOptions = async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 2,
        connectTimeoutMS: 20000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.db.databaseName} (host: ${conn.connection.host})`);
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      // Retry in 5 seconds if initial connect fails
      setTimeout(connectWithOptions, 5000);
    }
  };

  await connectWithOptions();

  mongoose.connection.on('disconnected', () => {
    console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
  });

  mongoose.connection.on('reconnected', () => {
    console.log("✅ MongoDB reconnected successfully.");
  });

  mongoose.connection.on('error', (err) => {
    console.error("❌ MongoDB runtime error:", err.message);
  });
};

export default dbconnect;