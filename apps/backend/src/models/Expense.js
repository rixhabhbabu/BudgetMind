import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  merchant: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["UPI", "Card", "Cash", "Bank"], default: "UPI" },
  spentAt: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

export const Expense = mongoose.models.Expense ?? mongoose.model("Expense", expenseSchema);
