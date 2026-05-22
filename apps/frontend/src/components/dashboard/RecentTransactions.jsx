import { Card } from "../ui/Card.jsx";

function formatDate(value) {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function RecentTransactions({ transactions = [] }) {
  return (
    <Card className="col-span-7">
      <h2 className="mb-4 text-lg font-bold">Recent transactions</h2>
      <div className="grid gap-3">
        {transactions.length ? (
          transactions.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center rounded-md border border-slate-100 p-3 dark:border-slate-800">
              <div>
                <strong>{item.merchant}</strong>
                <p className="text-sm text-slate-500">{item.category} • {item.method} • {formatDate(item.date)}</p>
              </div>
              <span className="font-bold">₹{Number(item.amount ?? 0).toLocaleString("en-IN")}</span>
            </div>
          ))
        ) : (
          <p className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-500 dark:bg-slate-900">No transactions found yet.</p>
        )}
      </div>
    </Card>
  );
}
