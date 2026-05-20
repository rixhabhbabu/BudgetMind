import { Target } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function BudgetPlanner() {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <Target className="text-ocean" />
        <h2 className="text-lg font-black">Smart budget planner</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Safe daily spend", "₹1,320"],
          ["Planned savings", "₹24,000"],
          ["Risk category", "Food"]
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
