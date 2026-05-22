import { Card } from "../ui/Card.jsx";

function formatValue(key, value) {
  if (value === undefined || value === null || value === "") return "Not found";
  if (key.toLowerCase().includes("amount") || key === "total") return `₹${Number(value).toLocaleString("en-IN")}`;
  if (key.toLowerCase().includes("confidence")) return `${Math.round(Number(value) * 100)}%`;
  if (key.toLowerCase().includes("date")) return new Date(value).toLocaleDateString("en-IN");
  return value;
}

export function BillPreview({ bill }) {
  const rows = bill ? {
    merchant: bill.extractedMerchant,
    amount: bill.extractedAmount,
    category: bill.extractedCategory,
    confidence: bill.confidence,
    date: bill.extractedDate
  } : {};

  return (
    <Card>
      <h2 className="mb-4 text-lg font-black">Extracted bill</h2>
      {bill ? (
        <div className="grid gap-3 text-sm">
          {Object.entries(rows).map(([key, value]) => <p key={key} className="flex justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900"><span className="capitalize text-slate-500">{key}</span><strong>{formatValue(key, value)}</strong></p>)}
        </div>
      ) : (
        <p className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-500 dark:bg-slate-900">Upload a bill to see extracted fields.</p>
      )}
    </Card>
  );
}
