import { MotionPage } from "../components/common/MotionPage.jsx";
import { CategoryDonut } from "../components/dashboard/CategoryDonut.jsx";
import { FinancialScore } from "../components/dashboard/FinancialScore.jsx";
import { InsightPanel } from "../components/dashboard/InsightPanel.jsx";
import { MetricCard } from "../components/dashboard/MetricCard.jsx";
import { RecentTransactions } from "../components/dashboard/RecentTransactions.jsx";
import { SpendingChart } from "../components/dashboard/SpendingChart.jsx";
import { OnboardingChecklist } from "../components/onboarding/OnboardingChecklist.jsx";

export function Dashboard() {
  return (
    <MotionPage>
      <div className="grid gap-5">
        <div className="metric-grid">
          <MetricCard label="Monthly spend" value="₹38,600" change="8.2%" positive={false} />
          <MetricCard label="Savings rate" value="31%" change="4.1%" />
          <MetricCard label="Bills forecast" value="₹12,450" change="2 due" positive={false} />
          <MetricCard label="Net worth" value="₹8.4L" change="6.8%" />
        </div>
        <div className="dashboard-grid">
          <FinancialScore />
          <SpendingChart />
          <CategoryDonut />
          <RecentTransactions />
          <InsightPanel />
          <div className="col-span-12"><OnboardingChecklist /></div>
        </div>
      </div>
    </MotionPage>
  );
}
