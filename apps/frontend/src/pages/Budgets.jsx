import { useEffect, useState } from "react";
import { BudgetPlanner } from "../components/budgets/BudgetPlanner.jsx";
import { BudgetProgress } from "../components/budgets/BudgetProgress.jsx";
import { fetchBudgets } from "../services/api.js";

export function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadBudgets() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBudgets();
        if (active) setBudgets(data);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load budgets.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadBudgets();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black">Budgets</h2>
        <p className="text-slate-500">Plan category limits and stay ahead of overspend risk.</p>
      </div>
      {loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Loading real budget data...</p>}
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      <BudgetPlanner budgets={budgets} />
      <BudgetProgress budgets={budgets} />
    </div>
  );
}
