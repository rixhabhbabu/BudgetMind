import { Target } from "lucide-react";
import { Card } from "../ui/Card.jsx";

function rupee(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export function BudgetPlanner({ budgets = [] }) {
  const totalLimit = budgets.reduce((sum, budget) => sum + Number(budget.limit ?? 0), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent ?? 0), 0);
  const remaining = Math.max(0, totalLimit - totalSpent);
  const riskBudget = budgets
    .filter((budget) => budget.limit)
    .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit))[0];

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <Target className="text-ocean" />
        <h2 className="text-lg font-black">Smart budget planner</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Monthly limit", rupee(totalLimit)],
          ["Remaining", rupee(remaining)],
          ["Highest risk", riskBudget?.category ?? "No budgets"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="text-xl">{value}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}
