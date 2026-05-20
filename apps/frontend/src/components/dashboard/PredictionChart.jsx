import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "../ui/Card.jsx";

const data = [
  { month: "Jun", predicted: 42000 },
  { month: "Jul", predicted: 39800 },
  { month: "Aug", predicted: 37400 },
  { month: "Sep", predicted: 36000 }
];

export function PredictionChart() {
  return (
    <Card className="col-span-6 min-h-[300px]">
      <h2 className="mb-4 text-lg font-black">AI prediction graph</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#d7e2df" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="predicted" stroke="#F97368" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
