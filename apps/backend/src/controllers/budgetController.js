import { Budget } from "../models/Budget.js";
import { summarizeBudgets } from "../services/budgetService.js";
import { recordAudit } from "../services/auditService.js";

export async function listBudgets(req, res, next) {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ category: 1 });
    res.json({ budgets: summarizeBudgets(budgets) });
  } catch (error) {
    next(error);
  }
}

export async function upsertBudget(req, res, next) {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, category: req.body.category },
      { ...req.body, userId: req.user.id },
      { upsert: true, new: true }
    );
    await recordAudit(req.user.id, "budget.upsert", "Budget", { category: budget.category });
    res.status(201).json({ budget });
  } catch (error) {
    next(error);
  }
}
