import { Mic } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function VoiceExpenseEntry() {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-black">Voice expense entry</h2>
        <p className="text-sm text-slate-500">Say “Paid 450 for coffee” and BudgetMind prepares the expense draft.</p>
      </div>
      <Button variant="secondary"><Mic size={18} />Start voice capture</Button>
    </Card>
  );
}
