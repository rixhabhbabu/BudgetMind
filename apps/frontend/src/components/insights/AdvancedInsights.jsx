import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle, Zap, CheckCircle2, Eye } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { api } from "../../services/api.js";

export function AdvancedInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdvancedInsights();
  }, []);

  async function fetchAdvancedInsights() {
    try {
      setLoading(true);
      setError(null);

      // First fetch user data to get income/budget/goals
      const userRes = await api.get("/auth/me");
      const userData = await userRes.json();

      // Fetch expenses
      const expensesRes = await api.get("/api/expenses");
      const expensesData = await expensesRes.json();

      // Fetch goals for progress
      const goalsRes = await api.get("/api/goals");
      const goalsData = await goalsRes.json();

      const completedGoals = goalsData.goals?.filter(g => g.completed)?.length || 0;
      const totalGoals = goalsData.goals?.length || 1;
      const goalsProgress = (completedGoals / totalGoals) * 100;

      // Call advanced insights endpoint
      const insightsRes = await api.post("/api/ai/advanced-insights", {
        expenses: expensesData.expenses || [],
        income: userData.monthlyIncome || 0,
        budget: userData.monthlyBudget || 70000,
        goalsProgress: goalsProgress || 0
      });

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
    } catch (err) {
      console.error("Failed to fetch advanced insights:", err);
      setError("Failed to load advanced insights");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <p className="text-center text-slate-500">Loading insights...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!insights) {
    return null;
  }

  const healthScore = insights.healthScore || 0;
  const healthColor = healthScore >= 800 ? "text-green-600" : healthScore >= 600 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="grid gap-5">
      {/* Financial Health Score */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <Eye className="text-ocean" />
          <h2 className="text-xl font-black">Financial Health Score</h2>
        </div>
        <div className={`text-4xl font-black ${healthColor}`}>{Math.round(healthScore)}/1000</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {healthScore >= 800
            ? "✅ Excellent financial health! Keep up the good habits."
            : healthScore >= 600
            ? "⚠️ Good health but room for improvement. Focus on budget adherence."
            : "❌ Needs improvement. Review your spending and create a budget."}
        </p>
      </Card>

      {/* Spending Patterns */}
      {insights.patterns?.hasRecurringExpenses && (
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <Zap className="text-ocean" />
            <h2 className="text-xl font-black">Recurring Expenses</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You have <strong>{insights.patterns.recurringExpenses.length}</strong> recurring expenses
              costing <strong>₹{insights.patterns.monthlyRecurringAmount.toLocaleString()}</strong>/month
            </p>
            {insights.patterns.recurringExpenses.slice(0, 5).map((exp, idx) => (
              <div key={idx} className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{exp.merchant}</p>
                    <p className="text-xs text-slate-500">{exp.category} • Recurring {exp.frequency}x</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{exp.amount}</p>
                    {exp.isSubscription && <p className="text-xs text-coral">Subscription</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Spending Trends */}
      {insights.trends && (
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="text-ocean" />
            <h2 className="text-xl font-black">Spending Trends</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-sm text-slate-600">Overall Trend</p>
              <p className={`text-lg font-black ${insights.trends.trend === "increasing" ? "text-red-600" : "text-green-600"}`}>
                {insights.trends.trend === "increasing" ? "📈 " : "📉 "}
                {Math.abs(insights.trends.trendPercentage)}% {insights.trends.trend}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Previous: ₹{insights.trends.previousSpending.toLocaleString()} → Recent: ₹{insights.trends.recentSpending.toLocaleString()}
              </p>
            </div>

            {/* Category Trends */}
            {insights.trends.categoryTrends?.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{cat.category}</p>
                    <p className="text-xs text-slate-500">{cat.trend}</p>
                  </div>
                  <p className={`font-semibold ${cat.percentage > 0 ? "text-red-600" : "text-green-600"}`}>
                    {cat.percentage > 0 ? "+" : ""}{cat.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Smart Recommendations */}
      {insights.smartRecommendations?.length > 0 && (
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <CheckCircle2 className="text-ocean" />
            <h2 className="text-xl font-black">Smart Recommendations</h2>
          </div>
          <div className="space-y-3">
            {insights.smartRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`rounded-md p-3 ${
                  rec.urgency === "high"
                    ? "border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                    : "border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                }`}
              >
                <p className="font-semibold">{rec.title}</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{rec.description}</p>
                {rec.potential_savings > 0 && (
                  <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                    💰 Potential savings: ₹{rec.potential_savings.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Budget Recommendations */}
      {insights.budgetRecommendations && (
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="text-ocean" />
            <h2 className="text-xl font-black">Budget Recommendations</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-sm text-slate-600">Recommended Budget</p>
              <p className="text-2xl font-black">₹{insights.budgetRecommendations.recommendedBudget?.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">
                Suggested Savings Rate: {insights.budgetRecommendations.recommendedSavingsRate}%
              </p>
            </div>

            {insights.budgetRecommendations.targetBreakdown && (
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                  <p className="text-xs text-slate-600">50% Needs</p>
                  <p className="font-semibold text-blue-700 dark:text-blue-200">
                    ₹{(insights.budgetRecommendations.targetBreakdown.needs50percent / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="rounded-md bg-purple-50 p-3 dark:bg-purple-950">
                  <p className="text-xs text-slate-600">30% Wants</p>
                  <p className="font-semibold text-purple-700 dark:text-purple-200">
                    ₹{(insights.budgetRecommendations.targetBreakdown.wants30percent / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="rounded-md bg-green-50 p-3 dark:bg-green-950">
                  <p className="text-xs text-slate-600">20% Savings</p>
                  <p className="font-semibold text-green-700 dark:text-green-200">
                    ₹{(insights.budgetRecommendations.targetBreakdown.savings20percent / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
