import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { Goal } from "../models/Goal.js";
import { buildDashboardSummary } from "../services/dashboardService.js";

export async function getDashboard(req, res, next) {
  try {
    const [expenses, budgets, goals] = await Promise.all([
      Expense.find({ userId: req.user.id }).limit(100),
      Budget.find({ userId: req.user.id }),
      Goal.find({ userId: req.user.id })
    ]);
    res.json(buildDashboardSummary({ expenses, budgets, goals }));
  } catch (error) {
    next(error);
  }
}
