import { useEffect, useState } from "react";
import { ReportExportButton } from "../components/reports/ReportExportButton.jsx";
import { SubscriptionDetector } from "../components/subscriptions/SubscriptionDetector.jsx";
import { Card } from "../components/ui/Card.jsx";
import { fetchDashboard } from "../services/api.js";

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSubscriptions() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchDashboard();
        if (active) setSubscriptions(data.subscriptions ?? []);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load recurring spend.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSubscriptions();
    return () => {
      active = false;
    };
  }, []);

  const monthlyTotal = subscriptions.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Recurring spend</h2>
          <p className="text-slate-500">Detect subscriptions and export a monthly report.</p>
        </div>
        <ReportExportButton />
      </div>
      {loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Loading real recurring spend...</p>}
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      <SubscriptionDetector subscriptions={subscriptions} />
      <Card>
        <h2 className="mb-2 text-lg font-black">Savings opportunity</h2>
        <p className="text-slate-600 dark:text-slate-300">
          {subscriptions.length ? `Reviewing these recurring charges could free up ₹${monthlyTotal.toLocaleString("en-IN")} this month.` : "No subscription savings estimate until recurring expenses are detected."}
        </p>
      </Card>
    </div>
  );
}
