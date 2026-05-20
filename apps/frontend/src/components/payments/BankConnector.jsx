import { Landmark } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function BankConnector() {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <Landmark className="text-ocean" />
        <h2 className="text-lg font-black">Bank transaction mock sync</h2>
      </div>
      <div className="grid gap-3">
        {["HDFC Savings", "SBI Salary", "Axis Current"].map((bank) => (
          <div key={bank} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900">
            <strong>{bank}</strong>
            <span className="text-ocean">Ready</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
