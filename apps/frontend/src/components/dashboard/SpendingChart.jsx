import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../ui/Card.jsx";

export function SpendingChart({ data = [] }) {
  return (
    <Card className="col-span-8 min-h-[320px]">
      <h2 className="mb-5 text-lg font-bold">Monthly cash flow</h2>
      {data.length ? (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spend" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#d7e2df" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="spend" stroke="#1D4ED8" fill="url(#spend)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="grid h-60 place-items-center rounded-md bg-slate-50 text-center text-sm font-semibold text-slate-500 dark:bg-slate-900">
          Add expenses to build your cash flow chart.
        </div>
      )}
    </Card>
  );
}
