import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyTrend } from "../../data/mockData.js";
import { Card } from "../ui/Card.jsx";

export function SpendingChart() {
  return (
    <Card className="col-span-8 min-h-[320px]">
      <h2 className="mb-5 text-lg font-bold">Monthly cash flow</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={monthlyTrend}>
          <defs>
            <linearGradient id="spend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#d7e2df" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area dataKey="spend" stroke="#0F766E" fill="url(#spend)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
