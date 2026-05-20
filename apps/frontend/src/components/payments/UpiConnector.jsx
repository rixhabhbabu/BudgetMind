import { Smartphone } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function UpiConnector() {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-mint text-ocean"><Smartphone /></div>
        <div>
          <h2 className="text-lg font-black">UPI inbox parser</h2>
          <p className="text-sm text-slate-500">Connect SMS exports or paste bank alerts.</p>
        </div>
      </div>
      <textarea className="mb-3 min-h-28 w-full rounded-md border border-slate-200 bg-white p-3 outline-none dark:border-slate-700 dark:bg-slate-900" defaultValue="Paid Rs. 620 to SWIGGY from HDFC Bank UPI Ref 540219" />
      <Button>Parse UPI message</Button>
    </Card>
  );
}
