import { GoalCard } from "../components/goals/GoalCard.jsx";

const goals = [
  { name: "Emergency fund", saved: 145000, target: 250000, deadline: "December 2026" },
  { name: "MacBook upgrade", saved: 72000, target: 180000, deadline: "August 2026" },
  { name: "Goa workation", saved: 28000, target: 55000, deadline: "July 2026" }
];

export function Goals() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black">Goals</h2>
        <p className="text-slate-500">Track savings goals with AI contribution guidance.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {goals.map((goal) => <GoalCard key={goal.name} goal={goal} />)}
      </div>
    </div>
  );
}
