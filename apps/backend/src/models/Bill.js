import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  imageUrl: String,
  extractedAmount: Number,
  extractedMerchant: String,
  extractedDate: Date,
  extractedCategory: String,
  confidence: Number,
  rawText: String
}, { timestamps: true });

export const Bill = mongoose.models.Bill ?? mongoose.model("Bill", billSchema);
