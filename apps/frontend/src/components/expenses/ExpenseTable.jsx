import { Card } from "../ui/Card.jsx";

export function ExpenseTable({ expenses }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="py-3">Merchant</th>
            <th>Category</th>
            <th>Method</th>
            <th>Date</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {!expenses.length && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500">No expenses found. Add your first expense to see real data here.</td>
            </tr>
          )}
          {expenses.map((item) => (
            <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="py-3 font-bold">{item.merchant}</td>
              <td>{item.category}</td>
              <td>{item.method}</td>
              <td>{item.date}</td>
              <td className="text-right font-bold">₹{item.amount.toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
