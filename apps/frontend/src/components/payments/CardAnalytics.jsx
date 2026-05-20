import { Card } from "../ui/Card.jsx";

export function CardAnalytics() {
  return (
    <Card className="lg:col-span-2">
      <h2 className="mb-4 text-lg font-black">Card analytics</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {["Rewards earned ₹1,820", "Interest risk ₹0", "Best card: ICICI Amazon Pay"].map((item) => <div key={item} className="rounded-md bg-slate-50 p-4 font-semibold dark:bg-slate-900">{item}</div>)}
      </div>
    </Card>
  );
}
