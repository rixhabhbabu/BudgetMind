import { CardAnalytics } from "../components/payments/CardAnalytics.jsx";
import { CardTracker } from "../components/payments/CardTracker.jsx";
import { UpiConnector } from "../components/payments/UpiConnector.jsx";

export function Payments() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <UpiConnector />
      <CardTracker />
      <CardAnalytics />
    </div>
  );
}
