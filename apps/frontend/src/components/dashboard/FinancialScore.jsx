import { Gauge } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function FinancialScore() {
  return (
    <Card className="col-span-12 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-md bg-ocean text-white"><Gauge /></div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Financial score</p>
          <strong className="text-3xl">786</strong>
        </div>
      </div>
      <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">Strong cash buffer, improving recurring spend, and stable credit utilization. Next milestone: keep discretionary spend under ₹22,000 this month.</p>
    </Card>
  );
}
