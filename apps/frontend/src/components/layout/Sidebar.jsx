import { useAuth } from "../../context/AuthContext.jsx";
import { Bell, Bot, CreditCard, FileScan, Flag, LayoutDashboard, ListFilter, PiggyBank, Repeat, Settings, ShieldCheck } from "lucide-react";

export const navItems = [
  ["dashboard", LayoutDashboard, "Dashboard"],
  ["expenses", ListFilter, "Expenses"],
  ["budgets", PiggyBank, "Budgets"],
  ["goals", Flag, "Goals"],
  ["insights", Bot, "AI"],
  ["payments", CreditCard, "Payments"],
  ["scanner", FileScan, "Scanner"],
  ["subscriptions", Repeat, "Subscriptions"],
  ["activity", Bell, "Activity"],
  ["admin", ShieldCheck, "Admin"],
  ["settings", Settings, "Settings"]
];

export function Sidebar({ activePage, onNavigate }) {
  const { user } = useAuth();
  const visibleItems = navItems.filter(([key]) => key !== "admin" || user?.role === "admin");

  return (
    <aside className="sticky top-0 h-screen border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-8 flex h-11 items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-ocean font-black text-white">B</div>
        <strong className="hidden text-lg lg:block">BudgetMind</strong>
      </div>
      <nav className="grid gap-2">
        {visibleItems.map(([key, Icon, label]) => (
          <button key={key} onClick={() => onNavigate(key)} className={`flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${activePage === key ? "bg-ocean text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
            <Icon size={19} />
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
