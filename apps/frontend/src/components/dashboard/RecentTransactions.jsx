import { transactions } from "../../data/mockData.js";
import { Card } from "../ui/Card.jsx";

export function RecentTransactions() {
  return (
    <Card className="col-span-7">
      <h2 className="mb-4 text-lg font-bold">Recent transactions</h2>
      <div className="grid gap-3">
        {transactions.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-center rounded-md border border-slate-100 p-3 dark:border-slate-800">
            <div>
              <strong>{item.merchant}</strong>
              <p className="text-sm text-slate-500">{item.category} • {item.method} • {item.date}</p>
            </div>
            <span className="font-bold">₹{item.amount.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
