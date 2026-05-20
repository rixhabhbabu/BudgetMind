export function calculateGoalContribution(goal, monthlySurplus = 12000) {
  const remaining = Math.max(0, goal.target - goal.saved);
  const suggestedMonthly = Math.min(remaining, Math.round(monthlySurplus * 0.35));
  return {
    remaining,
    suggestedMonthly,
    progress: Math.round((goal.saved / goal.target) * 100)
  };
}
