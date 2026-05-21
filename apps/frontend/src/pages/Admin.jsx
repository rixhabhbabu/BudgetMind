import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Database,
  Download,
  Eye,
  LockKeyhole,
  Server,
  ShieldCheck,
  UserCheck,
  Users
} from "lucide-react";
import { MotionPage } from "../components/common/MotionPage.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";

const adminMetrics = [
  { label: "Total users", value: "12,480", change: "+8.4%", icon: Users },
  { label: "Verified accounts", value: "10,936", change: "87.6%", icon: UserCheck },
  { label: "Risk alerts", value: "28", change: "6 high", icon: AlertTriangle },
  { label: "System uptime", value: "99.9%", change: "Healthy", icon: Server }
];

const users = [
  { name: "Ritesh Kumar", email: "ritesh@example.com", plan: "Pro", status: "Verified", spend: "Rs. 38,600", risk: "Low" },
  { name: "Ananya Singh", email: "ananya@example.com", plan: "Free", status: "Pending OTP", spend: "Rs. 18,240", risk: "Medium" },
  { name: "Mohit Sharma", email: "mohit@example.com", plan: "Pro", status: "Verified", spend: "Rs. 72,900", risk: "High" },
  { name: "Neha Verma", email: "neha@example.com", plan: "Free", status: "Verified", spend: "Rs. 9,420", risk: "Low" }
];

const alerts = [
  { title: "Multiple failed logins", detail: "5 attempts from new device", level: "High", time: "12 min ago" },
  { title: "Unusual spend spike", detail: "Card spend 240% above average", level: "Medium", time: "34 min ago" },
  { title: "Receipt OCR fallback", detail: "Scanner used mock parser", level: "Low", time: "1 hr ago" }
];

const health = [
  { service: "Frontend", status: "Online", detail: "Vite client responding" },
  { service: "Backend API", status: "Online", detail: "Express routes healthy" },
  { service: "AI Service", status: "Warning", detail: "Local FastAPI dependency needed" },
  { service: "Database", status: "Setup", detail: "Connect MongoDB URI" }
];

function StatusBadge({ value }) {
  const styles = {
    Verified: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    "Pending OTP": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    Online: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    Warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    Setup: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    High: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    Low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
  };

  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${styles[value] ?? styles.Setup}`}>
      {value}
    </span>
  );
}

export function Admin() {
  return (
    <MotionPage>
      <div className="grid gap-5">
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Admin control center</p>
            <h1 className="text-2xl font-black text-ink dark:text-white">Platform overview</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-300">
              Monitor users, verification status, risk activity, and core service health from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary"><Download size={18} /> Export</Button>
            <Button><ShieldCheck size={18} /> Review alerts</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map(({ label, value, change, icon: Icon }) => (
            <Card key={label}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <strong className="mt-2 block text-2xl font-black">{value}</strong>
                  <span className="mt-2 inline-block text-sm font-bold text-blue-700 dark:text-blue-300">{change}</span>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  <Icon size={21} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">User management</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Verification, plan, spend, and risk snapshot.</p>
              </div>
              <Button variant="secondary"><Users size={18} /> Manage roles</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Monthly spend</th>
                    <th className="px-3 py-2">Risk</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email} className="bg-slate-50 dark:bg-slate-900">
                      <td className="rounded-l-md px-3 py-3">
                        <strong className="block">{user.name}</strong>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold">{user.plan}</td>
                      <td className="px-3 py-3"><StatusBadge value={user.status} /></td>
                      <td className="px-3 py-3 font-semibold">{user.spend}</td>
                      <td className="px-3 py-3"><StatusBadge value={user.risk} /></td>
                      <td className="rounded-r-md px-3 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" aria-label={`View ${user.name}`}><Eye size={17} /></Button>
                          <Button variant="ghost" aria-label={`Restrict ${user.name}`}><Ban size={17} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-5">
            <Card>
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="text-coral" />
                <h2 className="text-lg font-black">Risk queue</h2>
              </div>
              <div className="grid gap-3">
                {alerts.map((alert) => (
                  <div key={alert.title} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm">{alert.title}</strong>
                      <StatusBadge value={alert.level} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
                    <span className="mt-2 block text-xs font-semibold text-slate-400">{alert.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <Database className="text-ocean" />
                <h2 className="text-lg font-black">Service health</h2>
              </div>
              <div className="grid gap-3">
                {health.map((item) => (
                  <div key={item.service} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                    <div>
                      <strong className="block text-sm">{item.service}</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</span>
                    </div>
                    <StatusBadge value={item.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Activity className="text-ocean" />
              <h2 className="text-lg font-black">Admin activity</h2>
            </div>
            <div className="grid gap-3 text-sm">
              {[
                "Updated OTP verification policy for signup.",
                "Reviewed high-risk transaction cluster.",
                "Exported monthly compliance snapshot.",
                "Changed platform color palette to trust blue."
              ].map((event, index) => (
                <p key={event} className="flex items-start gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                  <CheckCircle2 className="mt-0.5 text-ocean" size={18} />
                  <span><strong className="mr-2">#{index + 1}</strong>{event}</span>
                </p>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <LockKeyhole className="text-ocean" />
              <h2 className="text-lg font-black">Admin controls</h2>
            </div>
            <div className="grid gap-3">
              <Button variant="secondary">Force OTP recheck</Button>
              <Button variant="secondary">Freeze risky account</Button>
              <Button variant="secondary">Download audit report</Button>
              <Button>Open security review</Button>
            </div>
          </Card>
        </div>
      </div>
    </MotionPage>
  );
}
