import { Bill } from "../models/Bill.js";
import { Expense } from "../models/Expense.js";
import { extractReceipt } from "../services/ocrService.js";

export async function listBills(req, res, next) {
  try {
    const bills = await Bill.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ bills });
  } catch (error) {
    next(error);
  }
}

export async function uploadBill(req, res, next) {
  try {
    const extracted = await extractReceipt(req.file);
    const bill = await Bill.create({
      userId: req.user.id,
      imageUrl: req.file?.originalname ?? "demo-receipt.pdf",
      extractedAmount: extracted.total,
      extractedMerchant: extracted.merchant,
      extractedDate: new Date(),
      extractedCategory: extracted.category,
      confidence: extracted.confidence,
      rawText: extracted.items?.join(", ")
    });
    const expenseDraft = {
      merchant: bill.extractedMerchant,
      amount: bill.extractedAmount,
      category: bill.extractedCategory,
      paymentMethod: "Card",
      description: "Auto-filled from OCR receipt"
    };
    res.status(201).json({ bill, expenseDraft });
  } catch (error) {
    next(error);
  }
}

export async function createExpenseFromBill(req, res, next) {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.user.id });
    const expense = await Expense.create({
      userId: req.user.id,
      merchant: bill.extractedMerchant,
      amount: bill.extractedAmount,
      category: bill.extractedCategory,
      method: req.body.method ?? "Card",
      notes: "Created from scanned bill"
    });
    res.status(201).json({ expense });
  } catch (error) {
    next(error);
  }
}
