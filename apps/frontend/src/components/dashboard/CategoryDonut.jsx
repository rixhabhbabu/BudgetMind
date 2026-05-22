import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../ui/Card.jsx";

const colors = ["#1D4ED8", "#0F172A", "#60A5FA", "#F59E0B", "#DC2626"];

export function CategoryDonut({ data = [] }) {
  return (
    <Card className="col-span-4 min-h-[320px]">
      <h2 className="mb-5 text-lg font-bold">Category mix</h2>
      {data.length ? (
        <>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={data} innerRadius={58} outerRadius={90} paddingAngle={4} dataKey="value">
                {data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.map((item, index) => <span key={item.name} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: colors[index % colors.length] }} />{item.name}</span>)}
          </div>
        </>
      ) : (
        <div className="grid h-60 place-items-center rounded-md bg-slate-50 text-center text-sm font-semibold text-slate-500 dark:bg-slate-900">
          Category totals will appear after expenses are added.
        </div>
      )}
    </Card>
  );
}
