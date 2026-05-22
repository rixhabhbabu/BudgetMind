import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
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
import { fetchAdminOverview } from "../services/api.js";

function rupee(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
}

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
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadOverview() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAdminOverview();
        if (active) setOverview(data);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load admin overview.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOverview();
    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    { label: "Total users", value: overview?.metrics?.totalUsers ?? 0, change: "Real accounts", icon: Users },
    { label: "Verified accounts", value: overview?.metrics?.verifiedUsers ?? 0, change: "Email verified", icon: UserCheck },
    { label: "Risk alerts", value: overview?.metrics?.riskAlerts ?? 0, change: `${overview?.metrics?.highRisk ?? 0} high`, icon: AlertTriangle },
    { label: "Service status", value: overview?.health?.some((item) => item.status === "Warning") ? "Warning" : "Online", change: "Live checks", icon: Server }
  ];

  return (
    <MotionPage>
      <div className="grid gap-5">
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Admin control center</p>
            <h1 className="text-2xl font-black text-ink dark:text-white">Platform overview</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-300">
              Monitor real users, verification status, risk activity, and core service health from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary"><Download size={18} /> Export</Button>
            <Button><ShieldCheck size={18} /> Review alerts</Button>
          </div>
        </div>

        {loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Loading real platform data...</p>}
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, change, icon: Icon }) => (
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Verification, role, budget, spend, and risk snapshot.</p>
              </div>
              <Button variant="secondary"><Users size={18} /> Manage roles</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Monthly budget</th>
                    <th className="px-3 py-2">Monthly spend</th>
                    <th className="px-3 py-2">Risk</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.users ?? []).map((user) => (
                    <tr key={user.email} className="bg-slate-50 dark:bg-slate-900">
                      <td className="rounded-l-md px-3 py-3">
                        <strong className="block">{user.name}</strong>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold capitalize">{user.role}</td>
                      <td className="px-3 py-3"><StatusBadge value={user.status} /></td>
                      <td className="px-3 py-3 font-semibold">{rupee(user.monthlyBudget)}</td>
                      <td className="px-3 py-3 font-semibold">{rupee(user.monthlySpend)}</td>
                      <td className="px-3 py-3"><StatusBadge value={user.risk} /></td>
                      <td className="rounded-r-md px-3 py-3">
                        <Button variant="ghost" aria-label={`View ${user.name}`}><Eye size={17} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!overview?.users?.length && <p className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-500 dark:bg-slate-900">No users found.</p>}
            </div>
          </Card>

          <div className="grid gap-5">
            <Card>
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="text-coral" />
                <h2 className="text-lg font-black">Risk queue</h2>
              </div>
              <div className="grid gap-3">
                {(overview?.alerts ?? []).length ? overview.alerts.map((alert) => (
                  <div key={alert.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm">{alert.title}</strong>
                      <StatusBadge value={alert.level} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
                    <span className="mt-2 block text-xs font-semibold text-slate-400">{alert.user} • {formatDate(alert.createdAt)}</span>
                  </div>
                )) : <p className="text-sm font-semibold text-slate-500">No active risk notifications.</p>}
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <Database className="text-ocean" />
                <h2 className="text-lg font-black">Service health</h2>
              </div>
              <div className="grid gap-3">
                {(overview?.health ?? []).map((item) => (
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
              {(overview?.activity ?? []).length ? overview.activity.map((event) => (
                <p key={event.id} className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                  <strong className="mr-2">{event.action}</strong>{event.entity} by {event.user}
                  <span className="mt-1 block text-xs text-slate-500">{formatDate(event.createdAt)}</span>
                </p>
              )) : <p className="text-sm font-semibold text-slate-500">No admin activity recorded yet.</p>}
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
