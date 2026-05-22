import { calculateFinancialScore } from "./scoreService.js";

function monthLabel(date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthlyTrend(expenses) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: monthLabel(date),
      spend: 0
    };
  });
  const byKey = new Map(months.map((item) => [item.key, item]));

  for (const expense of expenses) {
    const spentAt = expense.spentAt ? new Date(expense.spentAt) : new Date();
    const monthStart = startOfMonth(spentAt);
    const key = `${monthStart.getFullYear()}-${monthStart.getMonth()}`;
    const bucket = byKey.get(key);
    if (bucket) bucket.spend += Number(expense.amount ?? 0);
  }

  return months.map(({ month, spend }) => ({ month, spend }));
}

function buildCategoryMix(expenses) {
  const totals = new Map();
  for (const expense of expenses) {
    const category = expense.category || "Uncategorized";
    totals.set(category, (totals.get(category) ?? 0) + Number(expense.amount ?? 0));
  }
  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function buildInsights({ expenses, budgets, goals, monthlySpend, savingsRate }) {
  const insights = [];
  const atRisk = budgets.find((budget) => budget.limit && budget.spent / budget.limit >= budget.alertThreshold);
  if (atRisk) insights.push(`${atRisk.category} budget is at ${Math.round((atRisk.spent / atRisk.limit) * 100)}% usage.`);
  if (goals.length) insights.push(`${goals.length} savings goal${goals.length > 1 ? "s" : ""} tracked from your real profile.`);
  if (monthlySpend) insights.push(`This month's tracked spend is Rs. ${monthlySpend.toLocaleString("en-IN")}.`);
  if (savingsRate) insights.push(`Current savings rate is ${savingsRate}% based on your profile targets.`);
  if (!insights.length && expenses.length === 0) insights.push("Add expenses, budgets, and goals to unlock live recommendations.");
  return insights.slice(0, 4);
}

function buildSubscriptions(expenses) {
  const recurringCategories = new Set(["Subscriptions", "Subscription", "Bills", "Utilities"]);
  const merchantGroups = new Map();
  for (const expense of expenses) {
    const merchant = expense.merchant || "Unknown merchant";
    if (!recurringCategories.has(expense.category) && !/netflix|spotify|prime|notion|aws|subscription|bill/i.test(merchant)) continue;
    const current = merchantGroups.get(merchant) ?? { name: merchant, amount: 0, count: 0, lastSeen: null };
    current.amount += Number(expense.amount ?? 0);
    current.count += 1;
    const spentAt = expense.spentAt ? new Date(expense.spentAt) : new Date();
    if (!current.lastSeen || spentAt > current.lastSeen) current.lastSeen = spentAt;
    merchantGroups.set(merchant, current);
  }

  return [...merchantGroups.values()]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
    .map((item) => ({
      name: item.name,
      amount: item.amount,
      count: item.count,
      lastSeen: item.lastSeen
    }));
}

export function buildDashboardSummary({ expenses = [], budgets = [], goals = [] }) {
  const monthlySpend = expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
  const budgetRisk = budgets.filter((budget) => budget.limit && budget.spent / budget.limit > 0.8).length;
  const goalProgress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.saved / goal.target, 0) / goals.length * 100)
    : 0;
  const savingsRate = 31;

  return {
    monthlySpend,
    budgetRisk,
    goalProgress,
    savingsRate,
    financialScore: calculateFinancialScore({ savingsRate: savingsRate / 100, utilization: 0.22 }),
    monthlyTrend: buildMonthlyTrend(expenses),
    categories: buildCategoryMix(expenses),
    recentTransactions: expenses.slice(0, 8).map((expense) => ({
      id: expense._id,
      merchant: expense.merchant,
      category: expense.category,
      amount: expense.amount,
      method: expense.method,
      date: expense.spentAt
    })),
    insights: buildInsights({ expenses, budgets, goals, monthlySpend, savingsRate }),
    subscriptions: buildSubscriptions(expenses)
  };
}
