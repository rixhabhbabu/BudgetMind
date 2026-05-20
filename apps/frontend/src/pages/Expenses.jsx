import { useState } from "react";
import { Plus } from "lucide-react";
import { AddExpenseModal } from "../components/expenses/AddExpenseModal.jsx";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters.jsx";
import { ExpenseTable } from "../components/expenses/ExpenseTable.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useExpenseQuery } from "../hooks/useExpenseQuery.js";

export function Expenses() {
  const query = useExpenseQuery();
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Expenses</h2>
          <p className="text-slate-500">Search, filter, and audit every rupee.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={18} />Add expense</Button>
      </div>
      <ExpenseFilters {...query} />
      <ExpenseTable expenses={query.expenses} />
      <AddExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
