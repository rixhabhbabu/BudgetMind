import { BudgetPlanner } from "../components/budgets/BudgetPlanner.jsx";
import { BudgetProgress } from "../components/budgets/BudgetProgress.jsx";

const budgets = [
  { category: "Food", spent: 12800, limit: 15000 },
  { category: "Travel", spent: 6400, limit: 9000 },
  { category: "Shopping", spent: 9100, limit: 10000 },
  { category: "Bills", spent: 11800, limit: 13000 }
];

export function Budgets() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black">Budgets</h2>
        <p className="text-slate-500">Plan category limits and stay ahead of overspend risk.</p>
      </div>
      <BudgetPlanner />
      <BudgetProgress budgets={budgets} />
    </div>
  );
}
