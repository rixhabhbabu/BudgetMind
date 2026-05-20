import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  issuer: { type: String, required: true },
  nickname: { type: String, required: true },
  maskedNumber: String,
  tokenizedNumber: String,
  limit: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  dueDate: Date,
  rewardsRate: Number,
  emiAmount: { type: Number, default: 0 },
  recurringPaymentDetected: { type: Boolean, default: false }
}, { timestamps: true });

export const Card = mongoose.models.Card ?? mongoose.model("Card", cardSchema);
