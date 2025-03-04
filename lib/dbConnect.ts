import mongoose from "mongoose";
import User from "@/models/user"

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  console.log("Connecting to DB...");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Creating index on username...");
  await User.collection.createIndex({ username: 1 });
};

export default connectDB;
