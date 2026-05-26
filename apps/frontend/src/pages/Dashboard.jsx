import { useEffect, useState } from "react";
import { Download, Loader } from "lucide-react";
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
import { Button } from "../components/ui/Button.jsx";
import { fetchDashboard, api } from "../services/api.js";

function rupee(value) {
  return `Rs. ${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [exportingPDF, setExportingPDF] = useState(false);

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

  async function downloadMonthlyReport() {
    try {
      setExportingPDF(true);
      const response = await fetch("/api/reports/monthly.pdf", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to generate report");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const monthName = new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' });
      a.download = `BudgetMind-Report-${monthName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to download report. Please try again.");
    } finally {
      setExportingPDF(false);
    }
  }

  return (
    <MotionPage>
      <div className="grid gap-5">
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
          </div>
          <Button onClick={downloadMonthlyReport} disabled={exportingPDF} className="flex items-center gap-2">
            <Download size={18} />
            {exportingPDF ? "Generating..." : "Download Report"}
          </Button>
        </div>
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
