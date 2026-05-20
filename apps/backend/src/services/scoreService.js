export function calculateFinancialScore({ savingsRate = 0.31, utilization = 0.22, billMisses = 0 }) {
  const score = 620 + savingsRate * 300 - utilization * 160 - billMisses * 35;
  return Math.max(300, Math.min(900, Math.round(score)));
}
