import { Card } from "../ui/Card.jsx";

export function CardAnalytics({ cards = [], transactions = [] }) {
  const totalLimit = cards.reduce((sum, card) => sum + Number(card.limit ?? 0), 0);
  const totalBalance = cards.reduce((sum, card) => sum + Number(card.balance ?? 0), 0);
  const utilization = totalLimit ? Math.round((totalBalance / totalLimit) * 100) : 0;
  const cardSpend = transactions.reduce((sum, transaction) => sum + Number(transaction.amount ?? 0), 0);

  return (
    <Card className="lg:col-span-2">
      <h2 className="mb-4 text-lg font-black">Card analytics</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          `Connected cards ${cards.length}`,
          `Current utilization ${utilization}%`,
          `Tracked card spend ₹${cardSpend.toLocaleString("en-IN")}`
        ].map((item) => <div key={item} className="rounded-md bg-slate-50 p-4 font-semibold dark:bg-slate-900">{item}</div>)}
      </div>
    </Card>
  );
}
