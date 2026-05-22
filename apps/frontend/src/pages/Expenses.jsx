import { useState } from "react";
import { Plus } from "lucide-react";
import { AddExpenseModal } from "../components/expenses/AddExpenseModal.jsx";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters.jsx";
import { ExpenseTable } from "../components/expenses/ExpenseTable.jsx";
import { VoiceExpenseEntry } from "../components/expenses/VoiceExpenseEntry.jsx";
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
      <VoiceExpenseEntry />
      <ExpenseFilters {...query} />
      {query.loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Loading real expense data...</p>}
      {query.error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{query.error}</p>}
      <ExpenseTable expenses={query.expenses} />
      <AddExpenseModal open={open} onClose={() => setOpen(false)} onSave={query.addExpense} />
    </div>
  );
}
