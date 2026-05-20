import { ShieldCheck } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ThemeToggle } from "../components/ui/ThemeToggle.jsx";

export function Settings() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <h2 className="mb-4 text-xl font-black">Workspace settings</h2>
        <div className="grid gap-4">
          <Input label="Display name" defaultValue="Ritesh" />
          <Input label="Monthly income" defaultValue="82000" />
          <Input label="Savings target" defaultValue="30%" />
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center gap-3"><ShieldCheck className="text-ocean" /><h2 className="text-xl font-black">Preferences</h2></div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900">
          <span className="font-semibold">Theme</span>
          <ThemeToggle />
        </div>
      </Card>
    </div>
  );
}
