export function summarizeBudgets(budgets) {
  return budgets.map((budget) => {
    const usage = budget.limit ? budget.spent / budget.limit : 0;
    return {
      id: budget._id,
      category: budget.category,
      limit: budget.limit,
      spent: budget.spent,
      usage,
      status: usage >= 1 ? "exceeded" : usage >= budget.alertThreshold ? "at_risk" : "healthy"
    };
  });
}
