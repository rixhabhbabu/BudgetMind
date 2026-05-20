import { CreditCard } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function CardTracker() {
  const cards = [
    { name: "HDFC Millennia", utilization: "22%", due: "₹8,240" },
    { name: "ICICI Amazon Pay", utilization: "31%", due: "₹12,990" }
  ];
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3"><CreditCard className="text-ocean" /><h2 className="text-lg font-black">Cards</h2></div>
      <div className="grid gap-3">
        {cards.map((card) => (
          <div key={card.name} className="rounded-md border border-slate-100 p-3 dark:border-slate-800">
            <strong>{card.name}</strong>
            <p className="text-sm text-slate-500">Utilization {card.utilization} • Due {card.due}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
