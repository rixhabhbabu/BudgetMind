import { CheckCircle2 } from "lucide-react";

export function Toast({ message = "Changes saved" }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-panel dark:border-emerald-900 dark:bg-slate-950">
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
}
