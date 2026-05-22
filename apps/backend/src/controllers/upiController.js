import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { parseUpiMessage } from "../services/upiParser.js";
import { encryptText } from "../utils/crypto.js";

export async function connectUpi(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    user.encryptedUpiId = encryptText(req.body.upiId);
    await user.save();
    res.status(201).json({ message: "UPI ID connected securely", app: req.body.app ?? "Google Pay" });
  } catch (error) {
    next(error);
  }
}

export async function listUpiTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.user.id, paymentSource: "UPI" }).sort({ timestamp: -1 }).limit(50);
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
}

export async function parseUpi(req, res) {
  res.json({ transaction: parseUpiMessage(req.body.message ?? "") });
}
