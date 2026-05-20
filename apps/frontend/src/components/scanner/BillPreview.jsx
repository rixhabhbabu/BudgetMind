import { Card } from "../ui/Card.jsx";

export function BillPreview({ bill }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-black">Extracted bill</h2>
      <div className="grid gap-3 text-sm">
        {Object.entries(bill).map(([key, value]) => <p key={key} className="flex justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900"><span className="capitalize text-slate-500">{key}</span><strong>{value}</strong></p>)}
      </div>
    </Card>
  );
}
