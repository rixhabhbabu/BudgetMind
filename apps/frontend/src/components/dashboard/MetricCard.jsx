import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function MetricCard({ label, value, change, positive = true }) {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <Card>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-2xl">{value}</strong>
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${positive ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}>
          <Icon size={14} />
          {change}
        </span>
      </div>
    </Card>
  );
}
