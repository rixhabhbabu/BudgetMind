import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  transactionType: { type: String, enum: ["debit", "credit"], default: "debit" },
  paymentSource: { type: String, enum: ["UPI", "Card", "Bank", "Cash"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  merchant: { type: String, required: true },
  reference: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction ?? mongoose.model("Transaction", transactionSchema);
