import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Auth Service - MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Auth Service - MongoDB connection error:", error);
  }
};
