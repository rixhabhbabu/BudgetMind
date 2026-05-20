import { BellRing } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function SubscriptionDetector() {
  const subscriptions = [
    { name: "Netflix", amount: "₹649", renewal: "May 28" },
    { name: "Notion", amount: "₹830", renewal: "Jun 2" },
    { name: "Spotify", amount: "₹119", renewal: "Jun 5" }
  ];
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3"><BellRing className="text-coral" /><h2 className="text-xl font-black">Subscription detector</h2></div>
      <div className="grid gap-3">
        {subscriptions.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-md border border-slate-100 p-3 dark:border-slate-800">
            <strong>{item.name}</strong>
            <span className="text-sm text-slate-500">{item.amount} • {item.renewal}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
