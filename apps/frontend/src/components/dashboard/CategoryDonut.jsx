import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { categories } from "../../data/mockData.js";
import { Card } from "../ui/Card.jsx";

const colors = ["#1D4ED8", "#0F172A", "#60A5FA", "#F59E0B", "#DC2626"];

export function CategoryDonut() {
  return (
    <Card className="col-span-4 min-h-[320px]">
      <h2 className="mb-5 text-lg font-bold">Category mix</h2>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={categories} innerRadius={58} outerRadius={90} paddingAngle={4} dataKey="value">
            {categories.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {categories.map((item, index) => <span key={item.name} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: colors[index] }} />{item.name}</span>)}
      </div>
    </Card>
  );
}
