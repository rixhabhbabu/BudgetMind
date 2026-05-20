import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  prediction: {
    nextMonthSpend: Number,
    futureSavings: Number,
    budgetRiskScore: Number
  },
  recommendations: [String],
  topSpendingCategory: String,
  savingsPotential: Number,
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const AIReport = mongoose.models.AIReport ?? mongoose.model("AIReport", aiReportSchema);
