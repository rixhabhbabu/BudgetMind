import { CreditCard } from "lucide-react";
import { Card } from "../ui/Card.jsx";

function formatDueDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "No due date";
}

export function CardTracker({ cards = [] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3"><CreditCard className="text-ocean" /><h2 className="text-lg font-black">Cards</h2></div>
      <div className="grid gap-3">
        {cards.length ? cards.map((card) => {
          const utilization = card.limit ? Math.round((Number(card.balance ?? 0) / Number(card.limit)) * 100) : 0;
          return (
            <div key={card._id} className="rounded-md border border-slate-100 p-3 dark:border-slate-800">
              <strong>{card.nickname || card.issuer}</strong>
              <p className="text-sm text-slate-500">Utilization {utilization}% • Due ₹{Number(card.balance ?? 0).toLocaleString("en-IN")} • {formatDueDate(card.dueDate)}</p>
            </div>
          );
        }) : <p className="text-sm font-semibold text-slate-500">No cards connected yet.</p>}
      </div>
    </Card>
  );
}
