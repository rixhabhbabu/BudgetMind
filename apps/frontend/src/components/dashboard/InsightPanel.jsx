import { Bot, Sparkles } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function InsightPanel({ insights = [] }) {
  return (
    <Card className="col-span-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-mint text-ocean"><Bot /></div>
        <h2 className="text-lg font-bold">AI recommendations</h2>
      </div>
      <div className="grid gap-3">
        {insights.length ? (
          insights.map((text) => (
            <p key={text} className="flex gap-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900"><Sparkles className="mt-0.5 shrink-0 text-amber" size={16} />{text}</p>
          ))
        ) : (
          <p className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-500 dark:bg-slate-900">Live recommendations will appear after your activity grows.</p>
        )}
      </div>
    </Card>
  );
}
