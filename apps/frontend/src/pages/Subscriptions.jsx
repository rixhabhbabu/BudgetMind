import { ReportExportButton } from "../components/reports/ReportExportButton.jsx";
import { SubscriptionDetector } from "../components/subscriptions/SubscriptionDetector.jsx";
import { Card } from "../components/ui/Card.jsx";

export function Subscriptions() {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Recurring spend</h2>
          <p className="text-slate-500">Detect subscriptions and export a monthly report.</p>
        </div>
        <ReportExportButton />
      </div>
      <SubscriptionDetector />
      <Card>
        <h2 className="mb-2 text-lg font-black">Savings opportunity</h2>
        <p className="text-slate-600 dark:text-slate-300">Canceling dormant trials can save ₹1,479 this month.</p>
      </Card>
    </div>
  );
}
