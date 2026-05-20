import { Expense } from "../models/Expense.js";

export async function listExpenses(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ spentAt: -1 }).limit(100);
    res.json({ expenses });
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req, res, next) {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ expense });
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    res.json({ expense });
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
