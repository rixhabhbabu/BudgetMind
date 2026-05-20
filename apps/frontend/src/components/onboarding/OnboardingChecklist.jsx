import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "../ui/Card.jsx";

const steps = [
  ["Connect UPI parser", true],
  ["Add first budget", true],
  ["Scan a receipt", false],
  ["Create savings goal", true],
  ["Export monthly report", false]
];

export function OnboardingChecklist() {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-black">Workspace readiness</h2>
      <div className="grid gap-3">
        {steps.map(([label, done]) => {
          const Icon = done ? CheckCircle2 : Circle;
          return <p key={label} className="flex items-center gap-3 text-sm"><Icon size={18} className={done ? "text-ocean" : "text-slate-400"} />{label}</p>;
        })}
      </div>
    </Card>
  );
}
