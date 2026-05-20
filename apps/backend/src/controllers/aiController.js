import { env } from "../config/env.js";
import { AIReport } from "../models/AIReport.js";
import { Expense } from "../models/Expense.js";

function summarize(expenses) {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});
  const topSpendingCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  return { totals, topSpendingCategory, total };
}

export async function getRecommendations(_req, res) {
  res.json({
    recommendations: [
      "Reduce food delivery by ₹1,800 this week.",
      "Keep card utilization below 30%.",
      "Move idle balance into emergency savings."
    ],
    source: env.aiServiceUrl
  });
}

export async function analyzeSpending(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ spentAt: -1 }).limit(200);
    const summary = summarize(expenses);
    const recommendations = [
      `Your highest spending category is ${summary.topSpendingCategory}.`,
      "Set an 80% alert for categories that cross their monthly average.",
      "Move surplus to goals immediately after salary credit."
    ];
    const report = await AIReport.create({
      userId: req.user.id,
      topSpendingCategory: summary.topSpendingCategory,
      savingsPotential: Math.round(summary.total * 0.12),
      recommendations
    });
    res.json({ report, totals: summary.totals, recommendations });
  } catch (error) {
    next(error);
  }
}

export async function predictSpending(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).limit(200);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.json({
      prediction: {
        nextMonthSpend: Math.round(total * 1.08 || 42000),
        futureSavings: Math.round((req.query.income ?? 82000) - (total * 1.08 || 42000)),
        budgetRiskScore: total > 50000 ? 78 : 42
      },
      model: "linear-regression-demo"
    });
  } catch (error) {
    next(error);
  }
}

export async function chatWithAssistant(req, res) {
  res.json({
    reply: `BudgetMind AI: ${req.body.message ? "Based on your recent spending, reduce non-essential expenses by 12% this week." : "Ask me about budgets, savings, subscriptions, or expense trends."}`,
    source: env.aiServiceUrl
  });
}
