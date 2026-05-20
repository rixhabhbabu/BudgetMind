import { Card } from "../components/ui/Card.jsx";

const events = [
  "Receipt scan created expense suggestion for Reliance Fresh.",
  "Food budget crossed 80% threshold.",
  "AI forecast updated month-end cash balance.",
  "UPI parser detected Swiggy transaction."
];

export function Activity() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black">Activity</h2>
        <p className="text-slate-500">Operational timeline for account events and alerts.</p>
      </div>
      <Card>
        <div className="grid gap-3">
          {events.map((event, index) => (
            <p key={event} className="rounded-md border border-slate-100 p-3 text-sm dark:border-slate-800">
              <strong className="mr-2 text-ocean">#{index + 1}</strong>{event}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
