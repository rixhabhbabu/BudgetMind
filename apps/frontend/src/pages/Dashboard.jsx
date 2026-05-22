import { useEffect, useState } from "react";
import { MotionPage } from "../components/common/MotionPage.jsx";
import { CategoryDonut } from "../components/dashboard/CategoryDonut.jsx";
import { FinancialScore } from "../components/dashboard/FinancialScore.jsx";
import { InsightPanel } from "../components/dashboard/InsightPanel.jsx";
import { MetricCard } from "../components/dashboard/MetricCard.jsx";
import { RecentTransactions } from "../components/dashboard/RecentTransactions.jsx";
import { SpendingChart } from "../components/dashboard/SpendingChart.jsx";
import { OnboardingChecklist } from "../components/onboarding/OnboardingChecklist.jsx";
import { PredictionChart } from "../components/dashboard/PredictionChart.jsx";
import { SpendingHeatmap } from "../components/dashboard/SpendingHeatmap.jsx";
import { fetchDashboard } from "../services/api.js";

function rupee(value) {
  return `Rs. ${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchDashboard();
        if (active) setSummary(data);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load dashboard data.");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <MotionPage>
      <div className="grid gap-5">
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <div className="metric-grid">
          <MetricCard label="Monthly spend" value={rupee(summary?.monthlySpend)} change="Real data" positive={false} />
          <MetricCard label="Savings rate" value={`${summary?.savingsRate ?? 0}%`} change="Profile based" />
          <MetricCard label="Budget risk" value={summary?.budgetRisk ?? 0} change="Active limits" positive={(summary?.budgetRisk ?? 0) === 0} />
          <MetricCard label="Goal progress" value={`${summary?.goalProgress ?? 0}%`} change="Saved goals" />
        </div>
        <div className="dashboard-grid">
          <FinancialScore />
          <SpendingChart data={summary?.monthlyTrend ?? []} />
          <CategoryDonut data={summary?.categories ?? []} />
          <RecentTransactions transactions={summary?.recentTransactions ?? []} />
          <InsightPanel insights={summary?.insights ?? []} />
          <PredictionChart />
          <SpendingHeatmap />
          <div className="col-span-12"><OnboardingChecklist /></div>
        </div>
      </div>
    </MotionPage>
  );
}
