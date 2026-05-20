import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true, min: 0 },
  spent: { type: Number, default: 0 },
  period: { type: String, enum: ["weekly", "monthly"], default: "monthly" },
  alertThreshold: { type: Number, default: 0.8 }
}, { timestamps: true });

export const Budget = mongoose.models.Budget ?? mongoose.model("Budget", budgetSchema);
