import { BellRing } from "lucide-react";
import { Card } from "../ui/Card.jsx";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "No date";
}

export function SubscriptionDetector({ subscriptions = [] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3"><BellRing className="text-coral" /><h2 className="text-xl font-black">Subscription detector</h2></div>
      <div className="grid gap-3">
        {subscriptions.length ? subscriptions.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-md border border-slate-100 p-3 dark:border-slate-800">
            <strong>{item.name}</strong>
            <span className="text-sm text-slate-500">₹{Number(item.amount ?? 0).toLocaleString("en-IN")} • last seen {formatDate(item.lastSeen)}</span>
          </div>
        )) : <p className="text-sm font-semibold text-slate-500">No recurring spend detected from your expenses yet.</p>}
      </div>
    </Card>
  );
}
