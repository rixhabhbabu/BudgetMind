import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Expenses } from "./pages/Expenses.jsx";
import { Insights } from "./pages/Insights.jsx";
import { Payments } from "./pages/Payments.jsx";
import { Scanner } from "./pages/Scanner.jsx";
import { Subscriptions } from "./pages/Subscriptions.jsx";

const pages = {
  dashboard: Dashboard,
  expenses: Expenses,
  insights: Insights,
  payments: Payments,
  scanner: Scanner,
  subscriptions: Subscriptions
};

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("dashboard");
  const Page = pages[page] ?? Dashboard;

  if (!user) return <AuthPage />;

  return (
    <AppLayout activePage={page} onNavigate={setPage}>
      <Page />
    </AppLayout>
  );
}
