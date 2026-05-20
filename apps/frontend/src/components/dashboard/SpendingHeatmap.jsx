import { Card } from "../ui/Card.jsx";

const days = Array.from({ length: 35 }, (_, index) => ({
  day: index + 1,
  level: index % 7 === 0 ? 4 : index % 5
}));

export function SpendingHeatmap() {
  return (
    <Card className="col-span-6">
      <h2 className="mb-4 text-lg font-black">Spending heatmap</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((item) => (
          <span key={item.day} title={`Day ${item.day}`} className="aspect-square rounded-md" style={{ backgroundColor: ["#E2E8F0", "#A7F3D0", "#2DD4BF", "#F59E0B", "#F97368"][item.level] }} />
        ))}
      </div>
    </Card>
  );
}
