import { Card } from "../ui/Card.jsx";

export function BudgetProgress({ budgets }) {
  return (
    <div className="grid gap-4">
      {budgets.length ? budgets.map((budget) => {
        const used = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
        return (
          <Card key={budget.category}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black">{budget.category}</h3>
                <p className="text-sm text-slate-500">₹{budget.spent.toLocaleString("en-IN")} of ₹{budget.limit.toLocaleString("en-IN")}</p>
              </div>
              <strong>{used}%</strong>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full ${used > 85 ? "bg-coral" : "bg-ocean"}`} style={{ width: `${used}%` }} />
            </div>
          </Card>
        );
      }) : (
        <Card>
          <p className="text-sm font-semibold text-slate-500">No budgets found yet. Add category limits to start tracking budget usage.</p>
        </Card>
      )}
    </div>
  );
}
