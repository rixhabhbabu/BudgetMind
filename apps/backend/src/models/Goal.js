import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  name: { type: String, required: true },
  target: { type: Number, required: true, min: 1 },
  saved: { type: Number, default: 0 },
  deadline: Date,
  status: { type: String, enum: ["active", "paused", "completed"], default: "active" }
}, { timestamps: true });

export const Goal = mongoose.models.Goal ?? mongoose.model("Goal", goalSchema);
