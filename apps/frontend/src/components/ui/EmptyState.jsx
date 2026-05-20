import { Inbox } from "lucide-react";
import { Card } from "./Card.jsx";

export function EmptyState({ title, description }) {
  return (
    <Card className="grid min-h-48 place-items-center text-center">
      <div>
        <Inbox className="mx-auto mb-3 text-slate-400" />
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </Card>
  );
}
