import { CalendarDays } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function GoalCard({ goal }) {
  const progress = Math.round((goal.saved / goal.target) * 100);
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{goal.name}</h3>
          <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={15} />{goal.deadline}</p>
        </div>
        <strong>{progress}%</strong>
      </div>
      <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-amber" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-slate-500">₹{goal.saved.toLocaleString("en-IN")} saved of ₹{goal.target.toLocaleString("en-IN")}</p>
    </Card>
  );
}
