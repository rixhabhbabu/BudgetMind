import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["budget", "goal", "bill", "security"], default: "budget" },
  readAt: Date
}, { timestamps: true });

export const Notification = mongoose.models.Notification ?? mongoose.model("Notification", notificationSchema);
