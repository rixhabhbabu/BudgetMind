import { useEffect, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Expenses } from "./pages/Expenses.jsx";
import { Insights } from "./pages/Insights.jsx";
import { Payments } from "./pages/Payments.jsx";
import { Scanner } from "./pages/Scanner.jsx";
import { Subscriptions } from "./pages/Subscriptions.jsx";
import { Budgets } from "./pages/Budgets.jsx";
import { Goals } from "./pages/Goals.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Activity } from "./pages/Activity.jsx";
import { Admin } from "./pages/Admin.jsx";

const pages = {
  dashboard: Dashboard,
  expenses: Expenses,
  budgets: Budgets,
  goals: Goals,
  insights: Insights,
  payments: Payments,
  scanner: Scanner,
  subscriptions: Subscriptions,
  activity: Activity,
  admin: Admin,
  settings: Settings
};

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("dashboard");
  const Page = pages[page] ?? Dashboard;

  useEffect(() => {
    if (user && page === "auth") setPage("dashboard");
    if (page === "admin" && user?.role !== "admin") setPage("dashboard");
  }, [page, user]);

  if (!user) return <AuthPage />;
  if (page === "auth") return <AuthPage />;
  if (page === "admin" && user?.role !== "admin") {
    return (
      <AppLayout activePage="dashboard" onNavigate={setPage}>
        <Dashboard />
      </AppLayout>
    );
  }

  return (
    <AppLayout activePage={page} onNavigate={setPage}>
      <Page />
    </AppLayout>
  );
}
