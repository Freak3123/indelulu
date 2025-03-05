import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    console.log(" Already connected to MongoDB");
    return;
  }

  console.log(" Connecting to MongoDB...");

  if (!process.env.MONGODB_URI) {
    throw new Error(" MONGODB_URI is missing in .env file");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Successfully connected to MongoDB!");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDB;
