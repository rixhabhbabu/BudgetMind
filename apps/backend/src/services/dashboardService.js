import { calculateFinancialScore } from "./scoreService.js";

export function buildDashboardSummary({ expenses = [], budgets = [], goals = [] }) {
  const monthlySpend = expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
  const budgetRisk = budgets.filter((budget) => budget.limit && budget.spent / budget.limit > 0.8).length;
  const goalProgress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.saved / goal.target, 0) / goals.length * 100)
    : 0;

  return {
    monthlySpend,
    budgetRisk,
    goalProgress,
    savingsRate: 31,
    financialScore: calculateFinancialScore({ savingsRate: 0.31, utilization: 0.22 })
  };
}
