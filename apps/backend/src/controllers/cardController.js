import { Card } from "../models/Card.js";
import { Transaction } from "../models/Transaction.js";
import { maskCardNumber, tokenizeCardNumber } from "../utils/crypto.js";

export async function listCards(req, res, next) {
  try {
    const cards = await Card.find({ userId: req.user.id });
    res.json({ cards });
  } catch (error) {
    next(error);
  }
}

export async function createCard(req, res, next) {
  try {
    const card = await Card.create({
      issuer: req.body.issuer,
      nickname: req.body.nickname,
      limit: req.body.limit,
      balance: req.body.balance ?? 0,
      dueDate: req.body.dueDate,
      rewardsRate: req.body.rewardsRate,
      maskedNumber: maskCardNumber(req.body.cardNumber),
      tokenizedNumber: tokenizeCardNumber(req.body.cardNumber),
      userId: req.user.id
    });
    res.status(201).json({ card });
  } catch (error) {
    next(error);
  }
}

export async function listCardTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.user.id, paymentSource: "Card" }).sort({ timestamp: -1 }).limit(50);
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
}
