import { Landmark } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function BankConnector({ upiTransactions = [], cardTransactions = [] }) {
  const sources = [
    { name: "UPI transactions", count: upiTransactions.length },
    { name: "Card transactions", count: cardTransactions.length }
  ];

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <Landmark className="text-ocean" />
        <h2 className="text-lg font-black">Payment sync</h2>
      </div>
      <div className="grid gap-3">
        {sources.map((source) => (
          <div key={source.name} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900">
            <strong>{source.name}</strong>
            <span className="text-ocean">{source.count} real records</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
