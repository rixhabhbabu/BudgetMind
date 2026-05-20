import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (process.env.SKIP_DB === "true") return;
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
  }
}
